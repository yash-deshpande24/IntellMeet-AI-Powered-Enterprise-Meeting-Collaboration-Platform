import React, { useState } from 'react';
import { mockTranscripts as initialTranscripts } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { useNotification } from '../../context/NotificationContext';
import {
  FileText,
  Search,
  Play,
  Pause,
  Download,
  Copy,
  Clock,
  Filter,
  Check,
  Volume2,
} from 'lucide-react';

export const TranscriptPage = () => {
  const { success } = useNotification();
  const [transcripts] = useState(initialTranscripts);
  const [search, setSearch] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('All');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:08:14');
  const [copied, setCopied] = useState(false);

  const speakers = ['All', ...new Set(transcripts.map((t) => t.speaker))];

  const filteredTranscripts = transcripts.filter((t) => {
    const matchesSpeaker = selectedSpeaker === 'All' || t.speaker === selectedSpeaker;
    const matchesSearch =
      t.text.toLowerCase().includes(search.toLowerCase()) ||
      t.speaker.toLowerCase().includes(search.toLowerCase());
    return matchesSpeaker && matchesSearch;
  });

  const handleCopyTranscript = () => {
    const text = transcripts.map((t) => `[${t.timestamp}] ${t.speaker}: ${t.text}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    success('Complete transcript copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSeek = (timestamp) => {
    setCurrentTime(timestamp);
    setIsPlaying(true);
    success(`Audio playback jumped to ${timestamp}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Audio Transcript
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Searchable diarized speech stream with multi-speaker identification and audio sync
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={copied ? Check : Copy}
            onClick={handleCopyTranscript}
          >
            {copied ? 'Copied' : 'Copy All'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={Download}
            onClick={() => success('Transcript downloaded (.JSON)')}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Audio Playback Bar */}
      <Card className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors shadow-glow-primary"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <div>
            <p className="text-xs font-bold text-slate-200">
              Sprint 24 Architecture Audio Sync
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Timestamp: {currentTime} / 00:52:14
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer">
            <div className="bg-indigo-500 h-full w-2/5 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <span>Spatial Audio Enhanced</span>
        </div>
      </Card>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Speaker:
          </span>
          <select
            value={selectedSpeaker}
            onChange={(e) => setSelectedSpeaker(e.target.value)}
            className="text-xs font-semibold rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {speakers.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search words in transcript..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Transcript Items */}
      <Card className="divide-y divide-slate-100 dark:divide-dark-border overflow-hidden">
        {filteredTranscripts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No dialogue matching your criteria.
          </div>
        ) : (
          filteredTranscripts.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSeek(item.timestamp)}
              className="p-5 flex items-start gap-4 hover:bg-slate-50/80 dark:hover:bg-dark-surface/50 transition-colors cursor-pointer group"
            >
              <Avatar src={item.avatar} name={item.speaker} size="sm" />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.speaker}
                    </span>
                    <button
                      type="button"
                      className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      {item.timestamp}
                    </button>
                  </div>

                  <Badge
                    size="sm"
                    variant={
                      item.sentiment === 'positive'
                        ? 'emerald'
                        : item.sentiment === 'caution'
                        ? 'amber'
                        : 'slate'
                    }
                  >
                    {item.sentiment}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
