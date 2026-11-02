import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockMeetings as initialMeetings } from '../../data/mockData';
import { meetingService } from '../../services/meetingService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { useNotification } from '../../context/NotificationContext';
import {
  Video,
  PlusCircle,
  Search,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Sparkles,
  Play,
  FileText,
  Filter,
  Lock,
  Check,
} from 'lucide-react';

export const MeetingsListPage = () => {
  const { success, info } = useNotification();
  const [meetings, setMeetings] = useState(initialMeetings);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'upcoming' | 'ongoing' | 'completed'
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch live meetings from backend with graceful fallback
  useEffect(() => {
    meetingService
      .getMeetings()
      .then((data) => {
        if (data?.meetings && data.meetings.length > 0) {
          const backendMapped = data.meetings.map((m) => ({
            id: m._id,
            code: m.roomCode,
            title: m.title,
            description: m.description,
            status: m.status === 'active' ? 'ongoing' : (m.status === 'scheduled' ? 'upcoming' : 'completed'),
            date: new Date(m.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
            time: new Date(m.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: `${m.duration || 30} min`,
            host: {
              name: m.hostName || m.host?.name || 'Enterprise Lead',
              avatar: m.hostAvatar || m.host?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            },
            participants: m.participants || [],
            hasAiSummary: !!m.summary?.executiveSummary,
            tags: m.summary?.tags || ['Enterprise', 'Sync'],
            passcode: m.passcode || '',
            requirePasscode: m.requirePasscode !== false,
          }));

          const existingCodes = new Set(backendMapped.map((b) => b.code));
          const uniqueInitial = initialMeetings.filter((im) => !existingCodes.has(im.code));
          setMeetings([...backendMapped, ...uniqueInitial]);
        }
      })
      .catch((err) => {
        console.warn('[MeetingsListPage] Using local mock meeting database:', err.message);
      });
  }, []);

  const filteredMeetings = meetings.filter((m) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'upcoming' && m.status === 'upcoming') ||
      (activeTab === 'ongoing' && m.status === 'ongoing') ||
      (activeTab === 'completed' && m.status === 'completed');

    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleCopyLink = (m) => {
    const code = typeof m === 'string' ? m : m.code;
    const pwd = typeof m === 'object' && m.passcode ? `?pwd=${encodeURIComponent(m.passcode)}` : '';
    const link = `${window.location.origin}/meetings/lobby/${code}${pwd}`;
    navigator.clipboard.writeText(link);
    success(`1-Click invite link with credentials for ${code} copied!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Meeting Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse upcoming conferences, join live active rooms, and copy Zoom-style invitations
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to="/meetings/join">
            <Button variant="secondary" leftIcon={ExternalLink}>
              Join by Code
            </Button>
          </Link>
          <Link to="/meetings/schedule">
            <Button variant="gradient" leftIcon={PlusCircle}>
              Schedule Meeting
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-dark-surface rounded-2xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Sessions' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'ongoing', label: 'Live Now' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search meetings by topic or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl text-xs bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Meeting Cards Grid */}
      {filteredMeetings.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No meetings found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search criteria or schedule a new enterprise conference.
            </p>
          </div>
          <Link to="/meetings/schedule">
            <Button variant="outline" size="sm" leftIcon={PlusCircle}>
              Schedule New Conference
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMeetings.map((meeting) => (
            <Card
              key={meeting.id || meeting.code}
              hover
              className="p-5 flex flex-col justify-between space-y-4 border border-slate-200/80 dark:border-dark-border"
            >
              <div className="space-y-3">
                {/* Status & Copy Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      variant={
                        meeting.status === 'ongoing'
                          ? 'rose'
                          : meeting.status === 'upcoming'
                          ? 'indigo'
                          : 'slate'
                      }
                      dot={meeting.status === 'ongoing'}
                    >
                      {meeting.status === 'ongoing'
                        ? 'Live Active'
                        : meeting.status === 'upcoming'
                        ? 'Scheduled'
                        : 'Concluded'}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {meeting.code}
                    </span>
                    {meeting.passcode && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        {meeting.passcode}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopyLink(meeting)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-surface"
                    title="Copy 1-Click Meeting Invite"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {meeting.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {meeting.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {meeting.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> {meeting.time} ({meeting.duration})
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {meeting.tags?.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-surface text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-dark-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {meeting.participants.slice(0, 3).map((p, pIdx) => (
                      <Avatar key={pIdx} src={p.avatar} name={p.name} size="xs" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {meeting.participants.length} invited
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {meeting.hasAiSummary && (
                    <Link to="/ai/summaries">
                      <Button variant="ghost" size="sm" leftIcon={Sparkles}>
                        AI Digest
                      </Button>
                    </Link>
                  )}

                  {meeting.status === 'completed' ? (
                    <Link to={`/meetings/history`}>
                      <Button variant="outline" size="sm" leftIcon={FileText}>
                        Archive
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/meetings/lobby/${meeting.code || meeting.id}${meeting.passcode ? `?pwd=${encodeURIComponent(meeting.passcode)}` : ''}`}>
                      <Button
                        variant={meeting.status === 'ongoing' ? 'primary' : 'outline'}
                        size="sm"
                      >
                        {meeting.status === 'ongoing' ? 'Join Now' : 'Open Lobby'}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
