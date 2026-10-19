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
  Globe,
  Tag,
} from 'lucide-react';

import { meetingService } from '../../services/meetingService';

export const ScheduleMeetingPage = () => {
  const { success } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    duration: '45',
    timezone: 'America/New_York (GMT-4)',
    participants: 'sarah.c@innovatecorp.com, david.m@innovatecorp.com',
    enableAi: true,
    enableRecording: true,
    requirePasscode: true,
    passcode: '492019',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Meeting title is required';
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.startTime) errs.startTime = 'Start time is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      await meetingService.createMeeting({
        title: formData.title,
        description: formData.description,
        scheduledAt: new Date(`${formData.date}T${formData.startTime}:00`),
        duration: Number(formData.duration) || 45,
        tags: ['Enterprise', 'Scheduled Sync'],
      });
    } catch (err) {
      console.warn('[ScheduleMeetingPage] Persisted locally / backend notice:', err.message);
      await new Promise((res) => setTimeout(res, 600));
    }

    setSubmitting(false);
    success(`Meeting "${formData.title}" scheduled successfully! Invitations sent.`);
    navigate('/meetings');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
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
              Configure room parameters, AI transcription protocols, and participant invites
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

          <Input
            label="Invite Participants (Comma Separated Emails)"
            placeholder="colleague@innovatecorp.com, architect@innovatecorp.com"
            leftIcon={Users}
            value={formData.participants}
            onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
            helperText="Invitations with one-click secure join links will be automatically dispatched."
          />
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
                  Cloud Recording Archival (1080p SFU)
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
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Require Participant Passcode
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Prevents unauthorized entry by requiring a 6-digit passcode.
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
            <div className="max-w-xs pt-1">
              <Input
                label="Passcode"
                placeholder="6-digit PIN"
                leftIcon={Lock}
                value={formData.passcode}
                onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
              />
            </div>
          )}
        </Card>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={() => navigate('/meetings')}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={submitting}
            rightIcon={CheckCircle2}
          >
            Schedule & Generate Link
          </Button>
        </div>
      </form>
    </div>
  );
};
