import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { mockMeetings } from '../../data/mockData';
import { useNotification } from '../../context/NotificationContext';
import {
  History,
  Search,
  Calendar,
  Clock,
  Play,
  Download,
  FileText,
  Sparkles,
  Share2,
  Filter,
} from 'lucide-react';

export const MeetingHistoryPage = () => {
  const { success } = useNotification();
  const [search, setSearch] = useState('');
  const completedMeetings = mockMeetings.filter((m) => m.status === 'completed');

  const filtered = completedMeetings.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownloadRecording = (title) => {
    success(`Downloading HD cloud recording for "${title}"...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Meeting History & Recordings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse archived calls, playback video recordings, and access searchable AI transcripts
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search archived calls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((meeting) => (
          <Card key={meeting.id} className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="slate">Recorded</Badge>
                  <span className="text-xs font-mono text-slate-500 font-semibold">{meeting.code}</span>
                  <span className="text-xs text-slate-400">• {meeting.date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {meeting.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to="/ai/summaries">
                  <Button variant="ghost" size="sm" leftIcon={Sparkles}>
                    AI Summary
                  </Button>
                </Link>
                <Link to="/ai/transcripts">
                  <Button variant="ghost" size="sm" leftIcon={FileText}>
                    Transcript
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={Download}
                  onClick={() => handleDownloadRecording(meeting.title)}
                >
                  Download (.MP4)
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {meeting.description}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Host:</span>
                <Avatar src={meeting.host.avatar} name={meeting.host.name} size="xs" />
                <span>{meeting.host.name}</span>
              </div>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Recorded Duration: {meeting.duration}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
