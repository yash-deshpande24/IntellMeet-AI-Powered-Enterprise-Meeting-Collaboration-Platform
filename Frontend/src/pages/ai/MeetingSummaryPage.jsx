import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNotification } from '../../context/NotificationContext';
import { getMeetingById, getMeetings } from '../../services/meetingService';
import {
  Sparkles,
  Copy,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Check,
  Tag,
  FileText,
  Calendar,
  ListChecks,
} from 'lucide-react';

export const MeetingSummaryPage = () => {
  const { id } = useParams(); // optional: /ai/summaries/:id
  const { success, info } = useNotification();
  const [copied, setCopied] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (id) {
          setMeeting(await getMeetingById(id));
        } else {
          // No id in the URL: show the latest meeting that has a summary
          const list = await getMeetings({ limit: 20 });
          const withSummary = list.find((m) => m.summary?.executiveSummary);
          if (!withSummary) setError('No meeting summaries yet. Finish a meeting to generate one.');
          setMeeting(withSummary || null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-sm text-slate-500 animate-pulse">Loading AI summary...</div>;
  }

  if (error || !meeting) {
    return (
      <Card className="p-8 space-y-3">
        <p className="text-sm text-rose-500">{error || 'Meeting not found.'}</p>
        <p className="text-xs text-slate-500">
          If you see "No authentication token", log out and log in again with a real account
          (for example admin@intellmeet.io).
        </p>
      </Card>
    );
  }

  const s = meeting.summary || {};
  const decisions = s.decisionsMade || [];
  const points = s.keyDiscussionPoints || [];
  const actions = s.actionItems || [];
  const tags = s.tags || [];

  const handleCopy = () => {
    const text = `${meeting.title}\n\nExecutive Summary:\n${s.executiveSummary}\n\nDecisions:\n${decisions.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    success('AI summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExport = () => {
    info('Choose "Save as PDF" in the print dialog');
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Summary link copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Meeting Intelligence Summary
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generated from the real meeting transcript
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" leftIcon={copied ? Check : Copy} onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="outline" size="sm" leftIcon={Download} onClick={handleExport}>
            Export PDF
          </Button>
          <Button variant="primary" size="sm" leftIcon={Share2} onClick={handleShare}>
            Copy Link
          </Button>
        </div>
      </div>

      <Card className="p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Metadata */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
              Room {meeting.roomCode}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{meeting.title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {s.generatedAt ? new Date(s.generatedAt).toLocaleString() : 'Not generated'}
              </span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Sentiment: {s.overallSentiment || 'n/a'}
              </span>
            </div>
          </div>
          <Badge variant="indigo" size="md">Sentiment score {s.sentimentScore ?? '-'}</Badge>
        </div>

        {/* Executive overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Executive Overview
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
            {s.executiveSummary || 'No summary has been generated for this meeting yet.'}
          </p>
        </div>

        {/* Key points */}
        {points.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Key Discussion Points
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {points.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border"
                >
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decisions */}
        {decisions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Decisions
            </h3>
            <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
              <ul className="space-y-2.5">
                {decisions.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action items */}
        {actions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-600" />
                Action Items ({actions.length})
              </h3>
              <Link to="/ai/action-items" className="text-xs text-indigo-600 font-semibold hover:underline">
                Manage action items
              </Link>
            </div>
            <div className="space-y-2">
              {actions.map((a) => (
                <div
                  key={a.id || a._id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{a.task}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {a.assignee}
                      {a.dueDate ? ` • due ${new Date(a.dueDate).toLocaleDateString()}` : ''}
                    </p>
                  </div>
                  <Badge variant="slate" size="sm">{a.priority}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Topics:
            </span>
            {tags.map((t, i) => (
              <Badge key={i} variant="slate" size="sm">#{t}</Badge>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};