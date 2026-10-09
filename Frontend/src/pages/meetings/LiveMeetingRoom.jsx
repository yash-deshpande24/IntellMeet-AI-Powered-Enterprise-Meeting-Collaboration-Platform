import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  StopCircle,
  Radio,
  Hand,
  Smile,
  MessageSquare,
  Users,
  Sparkles,
  PhoneOff,
  Maximize,
  Minimize,
  Send,
  Bot,
  Copy,
  Check,
  ShieldCheck,
  MoreVertical,
} from 'lucide-react';

export const LiveMeetingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, info } = useNotification();

  const {
    isMicOn,
    isCameraOn,
    isScreenSharing,
    isRecording,
    isHandRaised,
    activeTab,
    setActiveTab,
    activeSpeaker,
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
  } = useMeeting();

  const [meetingTimer, setMeetingTimer] = useState(1458); // seconds elapsed (e.g. 24:18)
  const [chatInput, setChatInput] = useState('');
  const [aiQuestionInput, setAiQuestionInput] = useState('');
  const [aiResponses, setAiResponses] = useState([
    {
      q: 'What did David Miller mention regarding WebRTC mesh latency?',
      a: 'David indicated that APAC edge cluster latency is measured at 14ms average with adaptive bitrate fallback enabled for low-bandwidth participants.',
      time: '02:35 PM',
    },
  ]);
  const [endMeetingModalOpen, setEndMeetingModalOpen] = useState(false);
  const [reactionsPopover, setReactionsPopover] = useState(false);

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput('');
  };

  const handleAskAi = (e) => {
    e.preventDefault();
    if (!aiQuestionInput.trim()) return;
    const userQ = aiQuestionInput;
    setAiQuestionInput('');

    // Simulate instant AI synthesis
    setTimeout(() => {
      setAiResponses((prev) => [
        ...prev,
        {
          q: userQ,
          a: `According to the current live conversation: Elena and David both agreed to implement fallback CSS tokens for WCAG AA compliance before Sprint 25 deployment.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      success('IntellBot synthesized an answer from the transcript');
    }, 800);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Meeting invite link copied to clipboard!');
  };

  const handleLeaveMeeting = () => {
    setEndMeetingModalOpen(false);
    navigate(`/meetings/ended/${id || 'meet-102'}`);
  };

  const emojiList = ['👍', '👏', '❤️', '🎉', '🔥', '💡'];

  return (
    <div className="relative flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-950 text-white">
      {/* Floating Reactions Layer */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {activeReactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute bottom-20 text-4xl animate-bounce"
            style={{ left: `${reaction.x}%` }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>

      {/* Main Video Arena */}
      <div className="flex-1 flex flex-col justify-between p-3 sm:p-5 overflow-hidden">
        {/* Top Info Bar inside Arena */}
        <div className="flex items-center justify-between pb-3 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Duration: {formatTimer(meetingTimer)}</span>
            </span>

            {isRecording && (
              <span className="text-xs font-bold text-rose-400 bg-rose-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-800 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>REC LIVE</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyInvite}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Invite</span>
            </button>
          </div>
        </div>

        {/* Video Grid Tiles */}
        <div
          className={`flex-1 grid gap-3 sm:gap-4 items-center justify-center auto-rows-fr overflow-y-auto ${
            participants.length <= 1
              ? 'grid-cols-1'
              : participants.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
          }`}
        >
          {participants.map((participant) => {
            const isSpeaker = activeSpeaker.includes(participant.name.split(' ')[0]);
            const isMe = participant.id === 'p-1';

            return (
              <div
                key={participant.id}
                className={`relative w-full h-full min-h-[200px] max-h-[380px] rounded-3xl bg-slate-900 overflow-hidden border-2 transition-all duration-200 flex items-center justify-center group ${
                  isSpeaker
                    ? 'border-indigo-500 shadow-glow-primary ring-2 ring-indigo-500/20'
                    : 'border-slate-800/80'
                }`}
              >
                {/* Simulated Video Stream or Avatar fallback */}
                {participant.isCameraOn ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-full h-full object-cover select-none"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Avatar name={participant.name} size="xl" />
                    <span className="text-xs text-slate-400 font-medium">Camera is off</span>
                  </div>
                )}

                {/* Top overlay badge: Active Speaker & Hand Raised */}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  {isSpeaker && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-600/90 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Speaking
                    </span>
                  )}
                  {isMe && isHandRaised && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center gap-1 animate-bounce">
                      <Hand className="w-3 h-3" /> Hand Raised
                    </span>
                  )}
                </div>

                {/* Bottom Overlay: Participant Name & Audio Status */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10">
                  <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-2 border border-slate-800/80">
                    <span className="truncate max-w-[150px]">{participant.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({participant.role})</span>
                  </div>

                  <div className="p-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80">
                    {participant.isMicOn ? (
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <MicOff className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Floating Meeting Control Bar */}
        <div className="pt-4 flex items-center justify-center z-30">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              className={`p-3 rounded-xl transition-all ${
                isMicOn
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-xl transition-all ${
                isCameraOn
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
              }`}
              title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Screen Share */}
            <button
              onClick={toggleScreenSharing}
              className={`p-3 rounded-xl transition-all hidden sm:block ${
                isScreenSharing
                  ? 'bg-indigo-600 text-white shadow-glow-primary'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Share Screen"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Record Toggle */}
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-all hidden sm:block ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title={isRecording ? 'Stop Cloud Recording' : 'Start Cloud Recording'}
            >
              <Radio className="w-5 h-5" />
            </button>

            {/* Raise Hand */}
            <button
              onClick={toggleRaiseHand}
              className={`p-3 rounded-xl transition-all ${
                isHandRaised
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Raise / Lower Hand"
            >
              <Hand className="w-5 h-5" />
            </button>

            {/* Reaction Emojis Popover */}
            <div className="relative">
              <button
                onClick={() => setReactionsPopover(!reactionsPopover)}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Send Reaction"
              >
                <Smile className="w-5 h-5" />
              </button>

              {reactionsPopover && (
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex gap-1.5 animate-slide-up z-50">
                  {emojiList.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        sendReaction(emoji);
                        setReactionsPopover(false);
                      }}
                      className="text-2xl p-1.5 hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-700 mx-1 hidden sm:block" />

            {/* Chat Panel Toggle */}
            <button
              onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
              className={`p-3 rounded-xl transition-all ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="In-meeting Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Participants Panel Toggle */}
            <button
              onClick={() => setActiveTab(activeTab === 'participants' ? null : 'participants')}
              className={`p-3 rounded-xl transition-all ${
                activeTab === 'participants'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Participants"
            >
              <Users className="w-5 h-5" />
            </button>

            {/* AI Assistant Drawer Toggle */}
            <button
              onClick={() => setActiveTab(activeTab === 'ai' ? null : 'ai')}
              className={`p-3 rounded-xl transition-all ${
                activeTab === 'ai'
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'bg-slate-800 hover:bg-slate-700 text-purple-300'
              }`}
              title="IntellBot AI Assistant"
            >
              <Bot className="w-5 h-5" />
            </button>

            {/* Leave / End Meeting Button */}
            <button
              onClick={() => setEndMeetingModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md ml-1"
              title="Leave Room"
            >
              <PhoneOff className="w-4 h-4" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Drawer (Chat / Participants / AI Bot) */}
      {activeTab && (
        <aside className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/95 backdrop-blur-md flex flex-col h-72 md:h-full z-20 animate-slide-up">
          {/* Drawer Header Tabs */}
          <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'chat'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('participants')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'participants'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                People ({participants.length})
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'ai'
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" /> IntellBot
              </button>
            </div>

            <button
              onClick={() => setActiveTab(null)}
              className="text-slate-400 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>

          {/* Tab 1: Chat Stream */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-slate-200">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-800/80 text-xs text-slate-200 leading-relaxed border border-slate-700/50">
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Send a message to everyone..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-3 pr-10 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-indigo-400 hover:text-white"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Participants List */}
          {activeTab === 'participants' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  In this meeting ({participants.length})
                </span>
                <button
                  onClick={() => info('All participants muted by host')}
                  className="text-[11px] text-rose-400 font-semibold hover:underline"
                >
                  Mute All
                </button>
              </div>

              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar src={p.avatar} name={p.name} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-[130px]">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{p.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {p.isMicOn ? (
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <MicOff className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    {p.isCameraOn ? (
                      <Video className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <VideoOff className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: IntellBot AI Assistant */}
          {activeTab === 'ai' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-800/60 text-xs text-purple-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-purple-300">
                    <Sparkles className="w-3.5 h-3.5" /> IntellBot Real-Time Assistant
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Listening to live audio. Ask questions about anything discussed so far!
                  </p>
                </div>

                {/* AI Responses History */}
                {aiResponses.map((res, i) => (
                  <div key={i} className="space-y-2">
                    <div className="text-[11px] font-semibold text-slate-300 bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60">
                      ❓ "{res.q}"
                    </div>
                    <div className="text-xs text-purple-100 bg-purple-950/40 p-3 rounded-xl border border-purple-800/40 leading-relaxed">
                      💡 {res.a}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ask Question Form */}
              <form onSubmit={handleAskAi} className="p-3 border-t border-slate-800">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask AI about this meeting..."
                    value={aiQuestionInput}
                    onChange={(e) => setAiQuestionInput(e.target.value)}
                    className="w-full bg-slate-800 border border-purple-700/60 rounded-xl pl-3 pr-10 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-purple-400 hover:text-white"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </aside>
      )}

      {/* Leave Meeting Confirmation Modal */}
      <Modal
        isOpen={endMeetingModalOpen}
        onClose={() => setEndMeetingModalOpen(false)}
        title="Leave or End Conference"
        subtitle="Choose whether to leave individually or terminate for all participants"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Your meeting transcript, audio archive, and autonomous AI executive summary will automatically compile in your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setEndMeetingModalOpen(false)}
            >
              Return to Call
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleLeaveMeeting}
            >
              End & View AI Summary
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
