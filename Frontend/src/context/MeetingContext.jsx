import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initSocket, getSocket, disconnectSocket } from '../services/socket';

// Create Meeting Context
const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
  // Audio, video, and screen sharing states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Active side panel tab ('chat' | 'participants' | 'ai' | null)
  const [activeTab, setActiveTab] = useState(null);
  const [activeSpeaker, setActiveSpeaker] = useState('David Miller');
  const [activeRoomCode, setActiveRoomCode] = useState(null);

  // Selected hardware devices
  const [selectedAudioInput, setSelectedAudioInput] = useState('Default - Studio Microphone');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('Default - Speakers / Headphones');
  const [selectedVideoInput, setSelectedVideoInput] = useState('Integrated HD Webcam');

  // Meeting participants list (initial mock baseline)
  const [participants, setParticipants] = useState([
    {
      id: 'p-1',
      name: 'Alex Vance (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Host',
      isMicOn: true,
      isCameraOn: true,
      isScreenSharing: false,
    },
    {
      id: 'p-2',
      name: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Co-Host',
      isMicOn: true,
      isCameraOn: true,
      isScreenSharing: false,
    },
    {
      id: 'p-3',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'Speaker',
      isMicOn: false,
      isCameraOn: true,
      isScreenSharing: false,
    },
    {
      id: 'p-4',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Attendee',
      isMicOn: true,
      isCameraOn: false,
      isScreenSharing: false,
    },
  ]);

  // In-meeting chat messages
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'cm-1',
      sender: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      text: 'Good afternoon everyone! Excited to walk through the 2.0 release.',
      time: '02:31 PM',
    },
    {
      id: 'cm-2',
      sender: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Audio and video link check: everything is streaming with 14ms latency.',
      time: '02:32 PM',
    },
  ]);

  // Floating emoji reactions
  const [activeReactions, setActiveReactions] = useState([]);

  // Room code ref for socket handlers
  const roomRef = useRef(activeRoomCode);
  useEffect(() => {
    roomRef.current = activeRoomCode;
  }, [activeRoomCode]);

  // Connect to live Socket.io room
  const joinMeetingRoom = (roomCode, user) => {
    setActiveRoomCode(roomCode);
    const token = localStorage.getItem('intellmeet_token');
    const socket = initSocket(token);

    if (socket) {
      socket.emit('join-room', { roomCode, user });

      // Handle peers list from backend
      socket.off('room-peers');
      socket.on('room-peers', ({ participants: peers }) => {
        if (peers && peers.length > 0) {
          const mappedPeers = peers.map((p) => ({
            id: p.socketId || p.userId,
            name: p.name,
            avatar: p.avatar,
            role: p.role || 'Member',
            isMicOn: !p.audioMuted,
            isCameraOn: !p.videoMuted,
            isScreenSharing: !!p.screenSharing,
          }));
          setParticipants((prev) => {
            const selfUser = prev.find((p) => p.id === 'p-1') || prev[0];
            return [selfUser, ...mappedPeers];
          });
        }
      });

      // Handle new user joined
      socket.off('user-joined');
      socket.on('user-joined', ({ participant: p }) => {
        setParticipants((prev) => {
          if (prev.some((x) => x.id === (p.socketId || p.userId))) return prev;
          return [
            ...prev,
            {
              id: p.socketId || p.userId,
              name: p.name,
              avatar: p.avatar,
              role: p.role || 'Member',
              isMicOn: !p.audioMuted,
              isCameraOn: !p.videoMuted,
              isScreenSharing: !!p.screenSharing,
            },
          ];
        });
      });

      // Handle user left
      socket.off('user-left');
      socket.on('user-left', ({ socketId }) => {
        setParticipants((prev) => prev.filter((p) => p.id !== socketId));
      });

      // Handle chat message broadcast
      socket.off('chat-message');
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

      // Handle floating reactions from peers
      socket.off('receive-reaction');
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
    disconnectSocket();
    setActiveRoomCode(null);
  };

  // Switch active speaker periodically for visual realism
  useEffect(() => {
    const speakerList = ['David Miller', 'Elena Rostova', 'Alex Vance (You)'];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % speakerList.length;
      setActiveSpeaker(speakerList[index]);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  // Toggle microphone
  const toggleMic = () => {
    setIsMicOn((prev) => {
      const nextState = !prev;
      setParticipants((list) =>
        list.map((p) => (p.id === 'p-1' ? { ...p, isMicOn: nextState } : p))
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
      setParticipants((list) =>
        list.map((p) => (p.id === 'p-1' ? { ...p, isCameraOn: nextState } : p))
      );
      const socket = getSocket();
      if (socket && roomRef.current) {
        socket.emit('media-toggle', { roomCode: roomRef.current, videoMuted: !nextState });
      }
      return nextState;
    });
  };

  // Toggle screen share
  const toggleScreenSharing = () => {
    setIsScreenSharing((prev) => {
      const next = !prev;
      const socket = getSocket();
      if (socket && roomRef.current) {
        socket.emit('screen-share-toggle', { roomCode: roomRef.current, isSharing: next });
      }
      return next;
    });
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

    // Remove reaction after 2.5 seconds
    setTimeout(() => {
      setActiveReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 2500);
  };

  // Send a chat message
  const sendChatMessage = (text, user) => {
    if (!text.trim()) return;

    const senderName = user?.name || 'Alex Vance (You)';
    const senderAvatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    const socket = getSocket();
    if (socket && roomRef.current) {
      socket.emit('chat-message', {
        roomCode: roomRef.current,
        message: text.trim(),
      });
    } else {
      // Local fallback
      const newMsg = {
        id: 'cm-' + Date.now(),
        sender: senderName,
        avatar: senderAvatar,
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, newMsg]);
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
        activeSpeaker,
        selectedAudioInput,
        setSelectedAudioInput,
        selectedAudioOutput,
        setSelectedAudioOutput,
        selectedVideoInput,
        setSelectedVideoInput,
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

// Custom hook to use meeting context
export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
