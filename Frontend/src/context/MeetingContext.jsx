import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Selected hardware devices
  const [selectedAudioInput, setSelectedAudioInput] = useState('Default - Studio Microphone');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('Default - Speakers / Headphones');
  const [selectedVideoInput, setSelectedVideoInput] = useState('Integrated HD Webcam');

  // Meeting participants list
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

  // Switch active speaker periodically to simulate real meeting dynamics
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
      return nextState;
    });
  };

  // Toggle screen share
  const toggleScreenSharing = () => {
    setIsScreenSharing((prev) => !prev);
  };

  // Toggle recording
  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  // Toggle raise hand
  const toggleRaiseHand = () => {
    setIsHandRaised((prev) => !prev);
  };

  // Send emoji reaction
  const sendReaction = (emoji) => {
    const reactionId = Date.now();
    const xPos = 40 + Math.random() * 20;

    setActiveReactions((prev) => [...prev, { id: reactionId, emoji, x: xPos }]);

    // Remove reaction after 2.5 seconds
    setTimeout(() => {
      setActiveReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 2500);
  };

  // Send a chat message
  const sendChatMessage = (text) => {
    if (!text.trim()) return;

    const newMsg = {
      id: 'cm-' + Date.now(),
      sender: 'Alex Vance (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
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
