import React, { useState } from 'react';
import { mockAiSummary } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNotification } from '../../context/NotificationContext';
import {
  Sparkles,
  Copy,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Check,
  TrendingUp,
  Tag,
  FileText,
  Calendar,
} from 'lucide-react';

export const MeetingSummaryPage = () => {
  const { success, info } = useNotification();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${mockAiSummary.title}\n\nExecutive Summary:\n${mockAiSummary.executiveSummary}\n\nDecisions:\n${mockAiSummary.decisions.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    success('AI summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExport = (format) => {
    success(`AI summary exported as .${format} to downloads!`);
  };

  const handleShare = () => {
    info('Summary link shared with all 4 meeting participants via email');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
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
            Autonomous multi-speaker synthesis, key discussion points, and executive decisions
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={copied ? Check : Copy}
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={Share2}
            onClick={handleShare}
          >
            Share with Team
          </Button>
        </div>
      </div>

      {/* Main Container Card */}
      <Card className="p-6 sm:p-8 space-y-8 shadow-xl">
        {/* Metadata Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
              Recorded Conference #{mockAiSummary.meetingId}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {mockAiSummary.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {mockAiSummary.generatedAt}
              </span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Sentiment: {mockAiSummary.sentiment}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="indigo" size="md">
              AI Accuracy {mockAiSummary.confidenceScore}
            </Badge>
          </div>
        </div>

        {/* Executive Overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Executive Overview
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
            {mockAiSummary.executiveSummary}
          </p>
        </div>

        {/* Key Discussion Points */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Key Discussion Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAiSummary.keyDiscussionPoints.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.topic}
                  </h4>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {item.timeOffset}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Decisions Taken */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Consensus & Approved Decisions
          </h3>
          <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
            <ul className="space-y-2.5">
              {mockAiSummary.decisions.map((dec, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{dec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Extracted Topic Tags */}
        <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Topic Entities:
          </span>
          {mockAiSummary.topics.map((t, i) => (
            <Badge key={i} variant="slate" size="sm">
              #{t}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};
