import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initSocket, getSocket, disconnectSocket } from '../services/socket';

const MeetingContext = createContext();

// Free public STUN servers for peer-to-peer connection discovery
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const MeetingProvider = ({ children }) => {
  // Mic and camera states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Active side panel tab ('chat' | 'participants' | 'ai' | null)
  const [activeTab, setActiveTab] = useState(null);
  const [activeRoomCode, setActiveRoomCode] = useState(null);
  const screenStreamRef = useRef(null);

  // Hardware devices
  const [deviceList, setDeviceList] = useState({
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
  });
  const [selectedAudioInput, setSelectedAudioInput] = useState('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('');
  const [selectedVideoInput, setSelectedVideoInput] = useState('');

  // Real local media stream
  const [localStream, setLocalStream] = useState(null);
  const localStreamRef = useRef(null);
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  // Real participants in the room
  const [participants, setParticipants] = useState([]);

  // In-meeting chat messages
  const [chatMessages, setChatMessages] = useState([]);

  // Floating emoji reactions
  const [activeReactions, setActiveReactions] = useState([]);

  // WebRTC mesh peer connections: { [peerSocketId]: RTCPeerConnection }
  const peersRef = useRef({});
  // Queue for ICE candidates arriving before remote description
  const candidateQueueRef = useRef({});

  // Room code ref for socket handlers
  const roomRef = useRef(activeRoomCode);
  useEffect(() => {
    roomRef.current = activeRoomCode;
  }, [activeRoomCode]);

  // Enumerate real input/output devices
  const getDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter((d) => d.kind === 'audioinput');
      const audioOutputs = devices.filter((d) => d.kind === 'audiooutput');
      const videoInputs = devices.filter((d) => d.kind === 'videoinput');

      setDeviceList({ audioInputs, audioOutputs, videoInputs });

      if (audioInputs.length > 0 && !selectedAudioInput) {
        setSelectedAudioInput(audioInputs[0].deviceId);
      }
      if (audioOutputs.length > 0 && !selectedAudioOutput) {
        setSelectedAudioOutput(audioOutputs[0].deviceId);
      }
      if (videoInputs.length > 0 && !selectedVideoInput) {
        setSelectedVideoInput(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('Could not enumerate devices:', err);
    }
  };

  // Start or switch real local camera and microphone stream
  const startLocalStream = async (videoId, audioId) => {
    try {
      // Stop old tracks if already active
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: {
    ...(videoId ? { deviceId: { exact: videoId } } : {}),
    width: { ideal: 1280 },
    height: { ideal: 720 },
    aspectRatio: { ideal: 16 / 9 },
    frameRate: { ideal: 30, max: 30 },
  },
  audio: audioId
    ? { deviceId: { exact: audioId } }
    : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      localStreamRef.current = stream;

      // Apply initial mic / camera enabled state
      stream.getAudioTracks().forEach((t) => {
        t.enabled = isMicOn;
      });
      stream.getVideoTracks().forEach((t) => {
        t.enabled = isCameraOn;
      });

      // Update self participant stream if already in a room
      setParticipants((prev) =>
        prev.map((p) => (p.isMe ? { ...p, stream } : p))
      );

      // Refresh device labels with permission granted
      await getDevices();

      return stream;
    } catch (err) {
      console.warn('Camera/Mic permission failed:', err);
      return null;
    }
  };

  // Create an RTCPeerConnection for a peer
  const createPeerConnection = (targetSocketId, socket) => {
    if (peersRef.current[targetSocketId]) {
      return peersRef.current[targetSocketId];
    }

    const pc = new RTCPeerConnection(iceServers);
    peersRef.current[targetSocketId] = pc;

    // Send local tracks to the remote peer
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // When ICE candidate is discovered, send it to the other user
    pc.onicecandidate = (event) => {
      if (event.candidate) {
       socket.emit('ice-candidate', {
  targetSocketId,
  candidate: event.candidate,
});
      }
    };

    // When remote track arrives, attach remote stream to that participant in state
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setParticipants((prev) =>
        prev.map((p) => (p.id === targetSocketId ? { ...p, stream: remoteStream } : p))
      );
    };

    return pc;
  };

  // Join meeting room with WebRTC mesh & Socket.io signaling
  const joinMeetingRoom = async (roomCode, user) => {
    setActiveRoomCode(roomCode);
    const token = localStorage.getItem('intellmeet_token');
    const socket = initSocket(token);

    // Make sure local stream is running
    let stream = localStreamRef.current;
    if (!stream) {
      stream = await startLocalStream(selectedVideoInput, selectedAudioInput);
    }

    if (socket) {
      socket.emit('join-room', { roomCode, token });

      socket.off('room-peers');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-media-toggle');
      socket.off('chat-message');
      socket.off('receive-reaction');

      socket.on('room-error', ({ message }) => {
  console.error('[Meeting Room Error]:', message);
  alert(message);
});

      // 1. Initial list of peers already in room
      socket.on('room-peers', ({ participants: peers, self }) => {
        const selfParticipant = {
          id: self.socketId,
          name: `${user?.name || 'You'} (You)`,
          avatar: user?.avatar,
          role: user?.role || 'Host',
          isMe: true,
          isMicOn: isMicOn,
          isCameraOn: isCameraOn,
          stream: localStreamRef.current,
        };

        const existingPeers = (peers || []).map((p) => ({
          id: p.socketId,
          name: p.name || 'Participant',
          avatar: p.avatar,
          role: p.role || 'Member',
          isMe: false,
          isMicOn: !p.audioMuted,
          isCameraOn: !p.videoMuted,
          stream: null,
        }));

        setParticipants([selfParticipant, ...existingPeers]);

        // Connect to existing peers (newcomer creates offer)
        (peers || []).forEach((peer) => {
          const pc = createPeerConnection(peer.socketId, socket);
          pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .then(() => {
             socket.emit('offer', {
  targetSocketId: peer.socketId,
  offer: pc.localDescription,
});
            })
            .catch((err) => console.log('Error creating WebRTC offer:', err));
        });
      });

      // 2. Another user joined room
      socket.on('user-joined', (p) => {
        setParticipants((prev) => {
          if (prev.some((x) => x.id === p.socketId)) return prev;
          return [
            ...prev,
            {
              id: p.socketId,
              name: p.name || 'Participant',
              avatar: p.avatar,
              role: p.role || 'Member',
              isMe: false,
              isMicOn: !p.audioMuted,
              isCameraOn: !p.videoMuted,
              stream: null,
            },
          ];
        });
      });

      // 3. Receive WebRTC Offer
     socket.on('offer', async ({ callerSocketId, offer }) => {
  const pc = createPeerConnection(callerSocketId, socket);

  try {
    await pc.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit('answer', {
      targetSocketId: callerSocketId,
      answer: pc.localDescription,
    });

    if (candidateQueueRef.current[callerSocketId]) {
      for (const cand of candidateQueueRef.current[callerSocketId]) {
        await pc.addIceCandidate(new RTCIceCandidate(cand));
      }

      delete candidateQueueRef.current[callerSocketId];
    }
  } catch (err) {
    console.error('Error answering offer:', err);
  }
});

      // 4. Receive WebRTC Answer
      socket.on('answer', async ({ responderSocketId, answer }) => {
  const pc = peersRef.current[responderSocketId];

  if (pc) {
    try {
      await pc.setRemoteDescription(
        new RTCSessionDescription(answer)
      );

      if (candidateQueueRef.current[responderSocketId]) {
        for (const cand of candidateQueueRef.current[responderSocketId]) {
          await pc.addIceCandidate(new RTCIceCandidate(cand));
        }

        delete candidateQueueRef.current[responderSocketId];
      }
    } catch (err) {
      console.error('Error setting remote answer:', err);
    }
  }
});

      // 5. Receive ICE Candidate
     socket.on('ice-candidate', async ({ senderSocketId, candidate }) => {
  const pc = peersRef.current[senderSocketId];

  if (pc && pc.remoteDescription) {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  } else {
    if (!candidateQueueRef.current[senderSocketId]) {
      candidateQueueRef.current[senderSocketId] = [];
    }

    candidateQueueRef.current[senderSocketId].push(candidate);
  }
});

      // 6. User media toggle
      socket.on('user-media-toggle', ({ socketId, audioMuted, videoMuted }) => {
        setParticipants((prev) =>
          prev.map((p) => {
            if (p.id !== socketId) return p;
            return {
              ...p,
              isMicOn: audioMuted !== undefined ? !audioMuted : p.isMicOn,
              isCameraOn: videoMuted !== undefined ? !videoMuted : p.isCameraOn,
            };
          })
        );
      });

      // 7. User left room
      socket.on('user-left', ({ socketId }) => {
        if (peersRef.current[socketId]) {
          peersRef.current[socketId].close();
          delete peersRef.current[socketId];
        }
        delete candidateQueueRef.current[socketId];
        setParticipants((prev) => prev.filter((p) => p.id !== socketId));
      });

      // 8. In-room chat
      socket.on('chat-message', (msg) => {
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [
            ...prev,
            {
              id: msg.id,
              sender: msg.sender,
              avatar: msg.senderAvatar,
              text: msg.text,
              time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ];
        });
      });

      // 9. Floating reactions
      socket.on('receive-reaction', (reaction) => {
        const xPos = 40 + Math.random() * 20;
        const newReaction = { id: reaction.id || Date.now(), emoji: reaction.emoji, x: xPos };
        setActiveReactions((prev) => [...prev, newReaction]);
        setTimeout(() => {
          setActiveReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
        }, 2500);
      });
    }
  };

  // Leave meeting room
  const leaveMeetingRoom = () => {
    // Close peer connections
    Object.values(peersRef.current).forEach((pc) => {
      try {
        pc.close();
      } catch (e) {}
    });
    peersRef.current = {};
    candidateQueueRef.current = {};

    // Stop local camera and microphone tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      localStreamRef.current = null;
    }

    setParticipants([]);
    setChatMessages([]);
    disconnectSocket();
    setActiveRoomCode(null);
  };

  // Toggle microphone
  const toggleMic = () => {
    setIsMicOn((prev) => {
      const nextState = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = nextState;
        });
      }
      setParticipants((list) =>
        list.map((p) => (p.isMe ? { ...p, isMicOn: nextState } : p))
      );
      const socket = getSocket();
      if (socket && roomRef.current) {
        socket.emit('media-toggle', { roomCode: roomRef.current, audioMuted: !nextState });
      }
      return nextState;
    });
  };

  // Toggle camera
  const toggleCamera = () => {
    setIsCameraOn((prev) => {
      const nextState = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach((track) => {
          track.enabled = nextState;
        });
      }
      setParticipants((list) =>
        list.map((p) => (p.isMe ? { ...p, isCameraOn: nextState } : p))
      );
      const socket = getSocket();
      if (socket && roomRef.current) {
        socket.emit('media-toggle', { roomCode: roomRef.current, videoMuted: !nextState });
      }
      return nextState;
    });
  };

  const toggleScreenSharing = async () => {
  try {
    // Stop screen sharing if already active
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setIsScreenSharing(false);
      return;
    }

    // Open browser screen-sharing picker
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    screenStreamRef.current = stream;
    setIsScreenSharing(true);

    // Reset state when user clicks browser's Stop sharing
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      screenStreamRef.current = null;
      setIsScreenSharing(false);
    });
  } catch (error) {
    if (error.name !== 'NotAllowedError') {
      console.error('Screen sharing error:', error);
    }
  }
};
  // Toggle recording
  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  // Toggle raise hand
  const toggleRaiseHand = () => {
    setIsHandRaised((prev) => {
      const next = !prev;
      const socket = getSocket();
      if (socket && roomRef.current) {
        socket.emit('hand-raise-toggle', { roomCode: roomRef.current, isRaised: next });
      }
      return next;
    });
  };

  // Send emoji reaction
  const sendReaction = (emoji, user) => {
    const reactionId = Date.now();
    const xPos = 40 + Math.random() * 20;

    setActiveReactions((prev) => [...prev, { id: reactionId, emoji, x: xPos }]);

    const socket = getSocket();
    if (socket && roomRef.current) {
      socket.emit('send-reaction', {
        roomCode: roomRef.current,
        emoji,
        userName: user?.name,
      });
    }

    setTimeout(() => {
      setActiveReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 2500);
  };

  // Send chat message
  const sendChatMessage = (text, user) => {
    if (!text.trim()) return;

    const socket = getSocket();
    if (socket && roomRef.current) {
      socket.emit('chat-message', {
        roomCode: roomRef.current,
        message: text.trim(),
      });
    }
  };

  return (
    <MeetingContext.Provider
      value={{
        isMicOn,
        isCameraOn,
        isScreenSharing,
        isRecording,
        isHandRaised,
        activeTab,
        setActiveTab,
        deviceList,
        selectedAudioInput,
        setSelectedAudioInput,
        selectedAudioOutput,
        setSelectedAudioOutput,
        selectedVideoInput,
        setSelectedVideoInput,
        getDevices,
        localStream,
        startLocalStream,
        participants,
        chatMessages,
        activeReactions,
        activeRoomCode,
        joinMeetingRoom,
        leaveMeetingRoom,
        toggleMic,
        toggleCamera,
        toggleScreenSharing,
        toggleRecording,
        toggleRaiseHand,
        sendReaction,
        sendChatMessage,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
