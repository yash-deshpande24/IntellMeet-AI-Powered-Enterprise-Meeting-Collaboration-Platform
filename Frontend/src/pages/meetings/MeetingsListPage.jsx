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
            passcode: '904812',
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

  const handleCopyLink = (code) => {
    navigator.clipboard.writeText(`https://intellmeet.io/join/${code}`);
    success(`Invite link for room ${code} copied to clipboard!`);
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
            Browse upcoming conferences, join live active rooms, and access AI archives
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to="/meetings/join">
            <Button variant="secondary" leftIcon={ExternalLink}>
              Join by Code
            </Button>
          </Link>
          <Link to="/meetings/schedule">
            <Button variant="primary" leftIcon={PlusCircle}>
              Schedule Meeting
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-dark-surface p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Rooms' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'ongoing', label: 'Live Now' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, code or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Meeting Cards Grid */}
      {filteredMeetings.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Video className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No meetings found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or tab filters to find what you're looking for.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredMeetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {meeting.status === 'ongoing' ? (
                      <Badge variant="emerald" dot>Live Room</Badge>
                    ) : meeting.status === 'completed' ? (
                      <Badge variant="slate">Concluded</Badge>
                    ) : (
                      <Badge variant="indigo">Scheduled</Badge>
                    )}
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      {meeting.code}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyLink(meeting.code)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-surface"
                    title="Copy Meeting Invite Link"
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
                    <Link to={`/meetings/lobby/${meeting.id}`}>
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
