import React, { createContext, useContext, useState, useEffect } from 'react';

const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState(null); // 'chat' | 'participants' | 'ai' | null
  const [activeSpeaker, setActiveSpeaker] = useState('David Miller');

  const [selectedAudioInput, setSelectedAudioInput] = useState('Default - Studio Microphone (Elgato Wave:3)');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState('Default - Spatial Audio Speakers (High Definition)');
  const [selectedVideoInput, setSelectedVideoInput] = useState('Integrated UltraHD 4K Brio Webcam');

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

  const [activeReactions, setActiveReactions] = useState([]);

  // Periodic active speaker toggle to simulate live conversation
  useEffect(() => {
    const speakers = ['David Miller', 'Elena Rostova', 'Alex Vance (You)'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % speakers.length;
      setActiveSpeaker(speakers[idx]);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const toggleMic = () => {
    setIsMicOn(prev => {
      const next = !prev;
      setParticipants(curr =>
        curr.map(p => (p.id === 'p-1' ? { ...p, isMicOn: next } : p))
      );
      return next;
    });
  };

  const toggleCamera = () => {
    setIsCameraOn(prev => {
      const next = !prev;
      setParticipants(curr =>
        curr.map(p => (p.id === 'p-1' ? { ...p, isCameraOn: next } : p))
      );
      return next;
    });
  };

  const toggleScreenSharing = () => {
    setIsScreenSharing(prev => !prev);
  };

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  const toggleRaiseHand = () => {
    setIsHandRaised(prev => !prev);
  };

  const sendReaction = (emoji) => {
    const id = Date.now() + Math.random();
    setActiveReactions(prev => [...prev, { id, emoji, x: 40 + Math.random() * 20 }]);
    setTimeout(() => {
      setActiveReactions(prev => prev.filter(r => r.id !== id));
    }, 2500);
  };

  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = {
      id: 'cm-' + Date.now(),
      sender: 'Alex Vance (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, newMsg]);
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

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
