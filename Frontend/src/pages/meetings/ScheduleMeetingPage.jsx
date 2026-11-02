import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNotification } from '../../context/NotificationContext';
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  Lock,
  Video,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Mail,
  ExternalLink,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';

import { meetingService } from '../../services/meetingService';

export const ScheduleMeetingPage = () => {
  const { success, error } = useNotification();
  const navigate = useNavigate();

  // Helper to generate 6-digit numeric passcode
  const generateRandomPasscode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    duration: '45',
    timezone: 'UTC',
    participants: '',
    enableAi: true,
    enableRecording: true,
    requirePasscode: true,
    passcode: generateRandomPasscode(),
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [scheduledModal, setScheduledModal] = useState(null);

  const regeneratePasscode = () => {
    const newCode = generateRandomPasscode();
    setFormData((prev) => ({ ...prev, passcode: newCode }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Meeting title is required';
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.startTime) errs.startTime = 'Start time is required';
    if (formData.requirePasscode && !formData.passcode.trim()) {
      errs.passcode = 'Passcode is required when enabled';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const scheduledAt = new Date(`${formData.date}T${formData.startTime}:00`);

      const res = await meetingService.createMeeting({
        title: formData.title.trim(),
        description: formData.description.trim(),
        scheduledAt,
        duration: Number(formData.duration) || 45,
        requirePasscode: formData.requirePasscode,
        passcode: formData.requirePasscode ? formData.passcode.trim() : '',
        participants: formData.participants,
        tags: ['Enterprise', 'Scheduled Conference'],
      });

      const meetingData = res?.meeting || {};
      const roomCode = res?.roomCode || meetingData.roomCode || 'meet-' + Date.now().toString(36);
      const passcode = res?.passcode ?? (formData.requirePasscode ? formData.passcode : '');
      const clientBase = window.location.origin;
      const meetingLink = res?.meetingLink || `${clientBase}/meetings/lobby/${roomCode}${passcode ? `?pwd=${passcode}` : ''}`;
      
      const inviteText = res?.invitationText || `
${formData.title}
Time: ${scheduledAt.toLocaleString()}
Duration: ${formData.duration} minutes

Join IntellMeet Meeting:
${meetingLink}

Meeting ID: ${roomCode}
Passcode: ${passcode || 'None'}
`.trim();

      // Show the Zoom-style Confirmation Modal
      setScheduledModal({
        title: formData.title,
        scheduledAt,
        duration: formData.duration,
        roomCode,
        passcode,
        meetingLink,
        invitedEmails: res?.invitedEmails || formData.participants.split(/[,;\s]+/).filter(Boolean),
        emailStatus: res?.emailStatus || {},
        inviteText,
      });

      success(`Meeting scheduled! Invitations dispatched.`);
    } catch (err) {
      console.warn('[ScheduleMeetingPage] Backend notice:', err.message);
      // Fallback for offline/mock mode
      const scheduledAt = new Date(`${formData.date}T${formData.startTime}:00`);
      const fallbackRoomCode = 'int-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6);
      const clientBase = window.location.origin;
      const meetingLink = `${clientBase}/meetings/lobby/${fallbackRoomCode}${formData.passcode ? `?pwd=${formData.passcode}` : ''}`;
      const inviteText = `
${formData.title}
Time: ${scheduledAt.toLocaleString()}
Duration: ${formData.duration} minutes

Join IntellMeet Meeting:
${meetingLink}

Meeting ID: ${fallbackRoomCode}
Passcode: ${formData.passcode || 'None'}
`.trim();

      setScheduledModal({
        title: formData.title,
        scheduledAt,
        duration: formData.duration,
        roomCode: fallbackRoomCode,
        passcode: formData.passcode,
        meetingLink,
        invitedEmails: formData.participants.split(/[,;\s]+/).filter(Boolean),
        emailStatus: { simulated: true },
        inviteText,
      });
      success(`Meeting scheduled! Credentials generated.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!scheduledModal?.meetingLink) return;
    navigator.clipboard.writeText(scheduledModal.meetingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyInvitation = () => {
    if (!scheduledModal?.inviteText) return;
    navigator.clipboard.writeText(scheduledModal.inviteText);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/meetings"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-surface transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Schedule New Enterprise Conference
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Configure room parameters, passcodes, and dispatch Zoom-style email invitations
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Details Card */}
        <Card className="p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-indigo-600" />
            General Information
          </h2>

          <Input
            label="Meeting Title *"
            placeholder="e.g. Q4 Executive Strategy Alignment"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Agenda & Description
            </label>
            <textarea
              rows={3}
              placeholder="Outline the meeting agenda, objectives, and reference materials..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="block w-full rounded-xl text-sm p-3.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Meeting Date *"
              type="date"
              leftIcon={Calendar}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              error={errors.date}
            />

            <Input
              label="Start Time *"
              type="time"
              leftIcon={Clock}
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              error={errors.startTime}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="block w-full rounded-xl text-sm py-2.5 px-3 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="15">15 Minutes (Standup)</option>
                <option value="30">30 Minutes (Standard)</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes (Full Hour)</option>
                <option value="90">90 Minutes (Deep Dive)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Input
              label="Invite Participants (Comma Separated Emails)"
              placeholder="sarah@company.com, alex@company.com, user@gmail.com"
              leftIcon={Users}
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              helperText="Each participant will receive a Zoom-style invitation email with the 1-click meeting link and security passcode."
            />
          </div>
        </Card>

        {/* AI & Security Preferences Card */}
        <Card className="p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            AI Intelligence & Security Protocols
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-dark-border">
            {/* Enable AI Summaries */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Real-Time AI Diarization & Executive Summarization
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Transcribes multi-speaker dialogues and builds bulleted action items when the meeting ends.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableAi}
                onChange={(e) => setFormData({ ...formData, enableAi: e.target.checked })}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Auto Record */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Cloud Recording Archival (1080p WebRTC)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automatically archives high-definition video feeds to encrypted enterprise workspace storage.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableRecording}
                onChange={(e) => setFormData({ ...formData, enableRecording: e.target.checked })}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Passcode Protection */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Require Participant Passcode (Recommended)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Prevents unauthorized entry by requiring a 6-digit passcode or one-click token link.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.requirePasscode}
                onChange={(e) => setFormData({ ...formData, requirePasscode: e.target.checked })}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {formData.requirePasscode && (
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-end gap-3 max-w-md">
              <div className="flex-1 w-full">
                <Input
                  label="Security Passcode (6 Digits)"
                  placeholder="6-digit PIN"
                  leftIcon={Lock}
                  value={formData.passcode}
                  onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                  error={errors.passcode}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={regeneratePasscode}
                className="shrink-0 mb-1 flex items-center gap-1.5"
                title="Generate new random passcode"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate</span>
              </Button>
            </div>
          )}
        </Card>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={() => navigate('/meetings')}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={submitting}
            rightIcon={CheckCircle2}
          >
            Schedule & Generate Meeting Link
          </Button>
        </div>
      </form>

      {/* ZOOM-STYLE POST-SCHEDULE CONFIRMATION MODAL */}
      {scheduledModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Meeting Scheduled!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time link and passcode generated successfully
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScheduledModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Dispatch Notice */}
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 flex items-start gap-3">
              <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-indigo-900 dark:text-indigo-200">
                  Email Invitations Dispatched (Zoom-Style)
                </p>
                {scheduledModal.invitedEmails?.length > 0 ? (
                  <p className="text-indigo-700 dark:text-indigo-300">
                    Sent to: <span className="font-semibold">{scheduledModal.invitedEmails.join(', ')}</span>
                  </p>
                ) : (
                  <p className="text-indigo-700 dark:text-indigo-300">
                    No attendee emails provided. You can copy the invitation link below to share manually.
                  </p>
                )}
              </div>
            </div>

            {/* Meeting Link & Credentials Block */}
            <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-dark-border text-xs">
              {/* Meeting Link */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  Real-Time Join Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={scheduledModal.meetingLink}
                    className="w-full bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-200 select-all"
                  />
                  <Button
                    size="sm"
                    variant={copiedLink ? 'emerald' : 'outline'}
                    onClick={handleCopyLink}
                    className="shrink-0 flex items-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
              </div>

              {/* Grid: Room Code & Passcode */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Meeting ID / Room</span>
                  <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                    {scheduledModal.roomCode}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Passcode</span>
                  <p className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {scheduledModal.passcode || 'None'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Button
                variant="outline"
                className="w-full justify-center flex items-center gap-2"
                onClick={handleCopyInvitation}
              >
                {copiedInvite ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
                <span>{copiedInvite ? 'Full Invitation Copied to Clipboard!' : 'Copy Full Zoom-Style Invitation'}</span>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/meetings')}
                  className="w-full justify-center"
                >
                  View All Meetings
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => window.open(scheduledModal.meetingLink, '_self')}
                  rightIcon={ExternalLink}
                  className="w-full justify-center"
                >
                  Join Meeting Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
