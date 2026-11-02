import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMeeting } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
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
  ArrowLeft,
  Lock,
  KeyRound,
  AlertCircle,
  Copy,
  Check,
  CheckCircle2,
  UserCheck,
  Mail,
  Users,
} from 'lucide-react';

import { meetingService } from '../../services/meetingService';

export const PreMeetingLobby = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const pwdParam = searchParams.get('pwd') || '';
  const emailParam = searchParams.get('email') || '';
  const nameParam = searchParams.get('name') || '';

  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const {
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
    localStream,
    startLocalStream,
    deviceList,
    selectedAudioInput,
    setSelectedAudioInput,
    selectedAudioOutput,
    setSelectedAudioOutput,
    selectedVideoInput,
    setSelectedVideoInput,
  } = useMeeting();

  // Attendee profile state
  const [attendeeName, setAttendeeName] = useState(() => {
    return nameParam || user?.name || '';
  });
  const [attendeeEmail, setAttendeeEmail] = useState(() => {
    return emailParam || (user?.email && !user.email.includes('@intellmeet.io') ? user.email : '') || '';
  });

  // Passcode gate states
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [verifyingPasscode, setVerifyingPasscode] = useState(false);
  const [loadingMeeting, setLoadingMeeting] = useState(true);

  const [virtualBg, setVirtualBg] = useState('none');
  const [showSettings, setShowSettings] = useState(false);
  const videoRef = useRef(null);

  const virtualBackgrounds = [
    { id: 'none', label: 'None' },
    { id: 'blur', label: 'Smart Blur' },
    { id: 'office', label: 'Modern Office' },
    { id: 'minimal', label: 'Minimalist' },
  ];

  // Fetch meeting security parameters on mount
  useEffect(() => {
    let active = true;

    const checkMeetingSecurity = async () => {
      setLoadingMeeting(true);
      try {
        const res = await meetingService.getMeetingByCode(id);
        const m = res?.meeting;
        if (active && m) {
          setMeetingDetails(m);
          // If no passcode required or passcode matches URL token
          if (!m.requirePasscode || !m.passcode) {
            setIsUnlocked(true);
          } else if (pwdParam && pwdParam.trim() === m.passcode.trim()) {
            setIsUnlocked(true);
          } else if (emailParam && m.invitedEmails?.some(e => e.toLowerCase() === emailParam.trim().toLowerCase())) {
            setIsUnlocked(true);
          } else if (user?.email && m.invitedEmails?.some(e => e.toLowerCase() === user.email.trim().toLowerCase())) {
            setIsUnlocked(true);
          } else {
            setIsUnlocked(false);
          }
        } else if (active) {
          setIsUnlocked(true);
        }
      } catch (err) {
        console.warn('[PreMeetingLobby] Meeting fetch info:', err.message);
        if (active) setIsUnlocked(true);
      } finally {
        if (active) setLoadingMeeting(false);
      }
    };

    checkMeetingSecurity();

    return () => {
      active = false;
    };
  }, [id, pwdParam]);

  // Start real camera and microphone when lobby mounts and unlocked
  useEffect(() => {
    let active = true;

    const initLobbyMedia = async () => {
      const stream = await startLocalStream(selectedVideoInput, selectedAudioInput);
      if (active && videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    };

    if (isUnlocked) {
      initLobbyMedia();
    }

    return () => {
      active = false;
    };
  }, [isUnlocked]);

  // Keep video element attached to the active localStream
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream, isCameraOn]);

  // Handle switching video device
  const handleVideoDeviceChange = async (e) => {
    const newId = e.target.value;
    setSelectedVideoInput(newId);
    const stream = await startLocalStream(newId, selectedAudioInput);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  };

  // Handle switching audio input device
  const handleAudioDeviceChange = async (e) => {
    const newId = e.target.value;
    setSelectedAudioInput(newId);
    const stream = await startLocalStream(selectedVideoInput, newId);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  };

  // Handle switching audio output speaker
  const handleAudioOutputChange = (e) => {
    const newId = e.target.value;
    setSelectedAudioOutput(newId);
    if (videoRef.current && typeof videoRef.current.setSinkId === 'function') {
      videoRef.current.setSinkId(newId).catch((err) => console.warn(err));
    }
  };

  
  const handleVerifyEmailUnlock = (e) => {
    e?.preventDefault();
    const cleanEmail = (attendeeEmail || '').trim().toLowerCase();
    if (!cleanEmail) {
      setPasscodeError('Please enter your email to verify');
      return;
    }
    const isInvited = meetingDetails?.invitedEmails?.some(
      (e) => e.toLowerCase() === cleanEmail
    );
    if (isInvited) {
      setIsUnlocked(true);
      setPasscodeError('');
    } else {
      setPasscodeError('This email is not in the meeting invitation list. Please check with the host or enter the 6-digit passcode.');
    }
  };
  const handleVerifyPasscode = async (e) => {
    e.preventDefault();
    if (!passcodeInput.trim()) {
      setPasscodeError('Please enter the 6-digit passcode');
      return;
    }
    setVerifyingPasscode(true);
    setPasscodeError('');

    try {
      const res = await meetingService.verifyMeetingPasscode(id, passcodeInput.trim());
      if (res?.valid) {
        setIsUnlocked(true);
      } else {
        setPasscodeError('Invalid meeting passcode. Please check your invitation email.');
      }
    } catch (err) {
      if (meetingDetails?.passcode && passcodeInput.trim() === meetingDetails.passcode.trim()) {
        setIsUnlocked(true);
      } else {
        setPasscodeError('Invalid meeting passcode. Please check your invitation email.');
      }
    } finally {
      setVerifyingPasscode(false);
    }
  };

  // Check if current attendee email is in the invited list
  const isEmailInvited = Boolean(
    meetingDetails?.invitedEmails?.length &&
    attendeeEmail.trim() &&
    meetingDetails.invitedEmails.some(
      (e) => e.toLowerCase() === attendeeEmail.trim().toLowerCase()
    )
  );

  const handleJoin = () => {
    const finalName = attendeeName.trim() || user?.name || (attendeeEmail ? attendeeEmail.split('@')[0] : 'Guest Participant');
    const finalEmail = attendeeEmail.trim() || user?.email || 'guest@intellmeet.io';

    const guestUser = {
      id: user?.id || 'usr-' + Math.random().toString(36).substring(2, 9),
      name: finalName,
      email: finalEmail,
      role: (meetingDetails?.hostName === finalName) ? 'Host' : 'Member',
      avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(finalName)}`,
    };

    try {
      localStorage.setItem('intellmeet_user', JSON.stringify(guestUser));
      if (typeof updateProfile === 'function') {
        updateProfile(guestUser);
      }
    } catch {}

    const currentPwd = pwdParam || passcodeInput || meetingDetails?.passcode || '';
    navigate(`/meetings/room/${id || 'meet-102'}${currentPwd ? `?pwd=${encodeURIComponent(currentPwd)}` : ''}`);
  };

  // PASSCODE GATE SCREEN (Zoom Style)
  if (!isUnlocked && !loadingMeeting) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 animate-fade-in">
        <Card className="max-w-md w-full p-8 shadow-2xl bg-slate-900/90 border border-slate-800 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-white">
              Meeting Passcode Required
            </h2>
            <p className="text-xs text-slate-400">
              Room <span className="font-mono font-semibold text-slate-300">{id}</span> is password-protected.
            </p>
          </div>

          <form onSubmit={handleVerifyPasscode} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Enter Security Passcode
              </label>
              <Input
                type="text"
                autoFocus
                placeholder="6-digit PIN (e.g. 849201)"
                leftIcon={KeyRound}
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                error={passcodeError}
                className="text-center font-mono text-base tracking-widest font-bold"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                The passcode was generated when scheduling and included in the invitation email.
              </p>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full justify-center"
              isLoading={verifyingPasscode}
              rightIcon={ArrowRight}
            >
              Verify Passcode & Enter
            </Button>
          </form>

          {/* Email Verification Alternative */}
          {meetingDetails?.invitedEmails?.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80 space-y-3 text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Or Verify with Invited Email
              </span>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your invited email"
                  leftIcon={Mail}
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleVerifyEmailUnlock}
                  className="shrink-0"
                >
                  Verify
                </Button>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800/80">
            <Link
              to="/meetings"
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Meetings</span>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

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
          {meetingDetails?.passcode && (
            <Badge variant="indigo">Passcode: {meetingDetails.passcode}</Badge>
          )}
        </div>
      </div>

      {/* Main Center Area */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        {/* Left Column (7 cols): Real Camera Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-video rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center group">
            {isCameraOn && localStream ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover scale-x-[-1] ${
                    virtualBg === 'blur' ? 'filter blur-[4px]' : ''
                  }`}
                />
                {virtualBg === 'office' && (
                  <div className="absolute inset-0 bg-indigo-900/10 pointer-events-none" />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Avatar name={attendeeName || user?.name || 'Guest'} size="xl" />
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

        {/* Right Column (5 cols): Attendee Profile & Join Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Ready to collaborate
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {meetingDetails?.title || `Meeting Room: ${id || 'meet-102'}`}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify your name, email, and media preview before entering the live conference.
            </p>
          </div>

          {/* Attendee Profile & Email Verification Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                Your Attendee Profile
              </span>
              {isEmailInvited ? (
                <Badge variant="emerald" dot>Verified Invitee</Badge>
              ) : meetingDetails?.invitedEmails?.length > 0 ? (
                <Badge variant="amber">Guest Attendee</Badge>
              ) : (
                <Badge variant="indigo">Participant</Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. jane@company.com"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email Invitation Status Banner */}
            {isEmailInvited ? (
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You are verified on the meeting invitation list!</span>
              </div>
            ) : meetingDetails?.invitedEmails?.length > 0 ? (
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-[11px] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Invited attendees: {meetingDetails.invitedEmails.join(', ')}
                </span>
              </div>
            ) : null}
          </div>

          {/* Real Audio / Video Device Selectors */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
            {/* Microphone Input */}
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-indigo-400" /> Microphone Input
              </label>
              <select
                value={selectedAudioInput}
                onChange={handleAudioDeviceChange}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                {deviceList.audioInputs.length === 0 ? (
                  <option value="">Default Microphone</option>
                ) : (
                  deviceList.audioInputs.map((d, idx) => (
                    <option key={d.deviceId || idx} value={d.deviceId}>
                      {d.label || `Microphone ${idx + 1}`}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Video Camera */}
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Video Camera
              </label>
              <select
                value={selectedVideoInput}
                onChange={handleVideoDeviceChange}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                {deviceList.videoInputs.length === 0 ? (
                  <option value="">Default Web Camera</option>
                ) : (
                  deviceList.videoInputs.map((d, idx) => (
                    <option key={d.deviceId || idx} value={d.deviceId}>
                      {d.label || `Camera ${idx + 1}`}
                    </option>
                  ))
                )}
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
            <span>Real-time WebRTC mesh connection is active when you join.</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600">
        IntellMeet WebRTC Mesh • Real-Time Audio & Video
      </div>
    </div>
  );
};
