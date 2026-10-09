import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Volume2,
  Camera,
  Image,
  ArrowLeft,
} from 'lucide-react';

export const PreMeetingLobby = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
    selectedAudioInput,
    setSelectedAudioInput,
    selectedAudioOutput,
    setSelectedAudioOutput,
    selectedVideoInput,
    setSelectedVideoInput,
  } = useMeeting();

  const [virtualBg, setVirtualBg] = useState('none');
  const [showSettings, setShowSettings] = useState(false);

  const virtualBackgrounds = [
    { id: 'none', label: 'None' },
    { id: 'blur', label: 'Smart Blur' },
    { id: 'office', label: 'Modern Office' },
    { id: 'minimal', label: 'Minimalist' },
  ];

  const handleJoin = () => {
    navigate(`/meetings/room/${id || 'meet-102'}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link to="/meetings" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-semibold">Back to Meetings</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="emerald" dot>E2EE Verified</Badge>
          <span className="text-xs text-slate-400 font-mono">Room: {id || 'meet-102'}</span>
        </div>
      </div>

      {/* Main Center Area */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        {/* Left Column (7 cols): Camera Preview Screen */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-video rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center group">
            {isCameraOn ? (
              <div className="relative w-full h-full">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'}
                  alt="Preview"
                  className={`w-full h-full object-cover ${
                    virtualBg === 'blur' ? 'filter blur-[3px]' : ''
                  }`}
                />
                {virtualBg === 'office' && (
                  <div className="absolute inset-0 bg-indigo-900/10 pointer-events-none" />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Avatar name={user?.name} size="xl" />
                <p className="text-sm font-semibold text-slate-400">Camera is turned off</p>
              </div>
            )}

            {/* Bottom floating toggles inside video frame */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 z-10">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3.5 rounded-2xl shadow-lg backdrop-blur-md transition-all ${
                  isMicOn
                    ? 'bg-slate-800/90 text-white hover:bg-slate-700/90'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
                title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={toggleCamera}
                className={`p-3.5 rounded-2xl shadow-lg backdrop-blur-md transition-all ${
                  isCameraOn
                    ? 'bg-slate-800/90 text-white hover:bg-slate-700/90'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
                title={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={`p-3.5 rounded-2xl shadow-lg backdrop-blur-md transition-all ${
                  showSettings
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/90 text-white hover:bg-slate-700/90'
                }`}
                title="Device settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Mic activity wave meter */}
            {isMicOn && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Microphone Active</span>
              </div>
            )}
          </div>

          {/* Virtual Background Options */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Virtual Effect:
            </span>
            <div className="flex gap-1.5">
              {virtualBackgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setVirtualBg(bg.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    virtualBg === bg.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Join Controls & Device Hardware */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Ready to collaborate
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Sprint 24 Architecture & WebRTC Sync
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              David Miller and 2 others are currently inside the room.
            </p>
          </div>

          {/* Quick Audio / Video Device Selectors */}
          <div className="space-y-3.5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-indigo-400" /> Microphone Input
              </label>
              <select
                value={selectedAudioInput}
                onChange={(e) => setSelectedAudioInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option>Default - Studio Microphone (Elgato Wave:3)</option>
                <option>MacBook Pro Microphone Array</option>
                <option>Bluetooth Headset Audio (AirPods Pro)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Audio Output (Speaker)
              </label>
              <select
                value={selectedAudioOutput}
                onChange={(e) => setSelectedAudioOutput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option>Default - Spatial Audio Speakers (High Definition)</option>
                <option>Built-in System Output</option>
                <option>External Monitor Output (DisplayPort)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Video Camera
              </label>
              <select
                value={selectedVideoInput}
                onChange={(e) => setSelectedVideoInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option>Integrated UltraHD 4K Brio Webcam</option>
                <option>FaceTime HD Camera (Built-in)</option>
                <option>OBS Virtual Camera Source</option>
              </select>
            </div>
          </div>

          {/* Join Button */}
          <Button
            size="lg"
            variant="gradient"
            className="w-full shadow-glow-primary"
            onClick={handleJoin}
            rightIcon={ArrowRight}
          >
            Join Meeting Now
          </Button>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>AI transcription is active. Participants are notified upon entry.</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600">
        IntellMeet Enterprise WebRTC Engine v2.4 • High Performance Node Active
      </div>
    </div>
  );
};
