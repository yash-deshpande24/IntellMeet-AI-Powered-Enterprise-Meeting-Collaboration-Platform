import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import {
  mockMeetings,
  mockActionItems as initialActions,
  mockAiSummary,
  mockActivityFeed,
} from '../../data/mockData';
import {
  Video,
  PlusCircle,
  Calendar,
  Clock,
  CheckSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Users,
  Play,
  FileText,
  AlertCircle,
  CheckCircle2,
  Copy,
  ChevronRight,
} from 'lucide-react';

import { meetingService } from '../../services/meetingService';
import { taskService } from '../../services/taskService';

export const DashboardOverview = () => {
  const { user } = useAuth();
  const { success, info } = useNotification();
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState(mockMeetings);
  const [actions, setActions] = useState(initialActions);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinMeetingId, setJoinMeetingId] = useState('');

  // Fetch backend meetings and tasks with graceful fallback
  React.useEffect(() => {
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
          const uniqueInitial = mockMeetings.filter((im) => !existingCodes.has(im.code));
          setMeetings([...backendMapped, ...uniqueInitial]);
        }
      })
      .catch(() => {});

    taskService
      .getTasks()
      .then((data) => {
        if (data?.tasks && data.tasks.length > 0) {
          const mapped = data.tasks.map((t) => ({
            id: t._id,
            meetingId: t.meetingId?._id || 'custom',
            meetingTitle: t.meetingId?.title || 'Platform Architecture Board',
            title: t.title,
            assignee: {
              name: t.assignee || 'Alex Vance',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            },
            dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '2026-10-24',
            priority: t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Medium',
            status: t.status === 'done' ? 'completed' : 'pending',
            completed: t.status === 'done',
          }));

          const existingIds = new Set(mapped.map((m) => m.id));
          const uniqueInitial = initialActions.filter((a) => !existingIds.has(a.id));
          setActions([...mapped, ...uniqueInitial]);
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    {
      title: 'Upcoming Meetings',
      value: '3 Today',
      change: '+1 from yesterday',
      icon: Calendar,
      color: 'indigo',
    },
    {
      title: 'Completed Meetings',
      value: `${user?.stats?.totalMeetings || 124}`,
      change: '18 this month',
      icon: Video,
      color: 'purple',
    },
    {
      title: 'Pending Action Items',
      value: `${actions.filter((a) => !a.completed).length} Tasks`,
      change: '2 due today',
      icon: CheckSquare,
      color: 'amber',
    },
    {
      title: 'AI Summaries Generated',
      value: `${user?.stats?.aiSummariesGenerated || 98}`,
      change: '99.4% accuracy',
      icon: Sparkles,
      color: 'emerald',
    },
  ];

  const toggleAction = (id) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const next = !act.completed;
          if (next) success(`Task "${act.title}" marked completed!`);
          return { ...act, completed: next };
        }
        return act;
      })
    );
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinMeetingId.trim()) return;
    setJoinModalOpen(false);
    navigate(`/meetings/lobby/${joinMeetingId.trim()}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Good afternoon, {user?.name?.split(' ')[0] || 'Alex'} 👋
            </h1>
            <Badge variant="indigo" size="sm">Workspace Admin</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            You have <strong className="text-slate-700 dark:text-slate-200">2 upcoming meetings</strong> scheduled today and 1 AI briefing ready for review.
          </p>
        </div>

        {/* 3 Key Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/meetings/lobby/meet-102">
            <Button variant="primary" leftIcon={Video} size="md">
              Start Meeting
            </Button>
          </Link>
          <Button
            variant="secondary"
            leftIcon={ExternalLink}
            size="md"
            onClick={() => setJoinModalOpen(true)}
          >
            Join with ID
          </Button>
          <Link to="/meetings/schedule">
            <Button variant="outline" leftIcon={PlusCircle} size="md">
              Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  {stat.title}
                </p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white truncate">
                  {stat.value}
                </p>
                <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> {stat.change}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Grid: Upcoming Meetings & AI Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Upcoming Meetings & Action Items */}
        <div className="lg:col-span-8 space-y-8">
          {/* Upcoming Meetings List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Upcoming & Active Meetings
                </h2>
              </div>
              <Link to="/meetings" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                View All Schedule <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {meetings.slice(0, 3).map((meeting) => (
                <Card
                  key={meeting.id}
                  className="p-5 transition-all hover:border-indigo-200 dark:hover:border-indigo-800"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {meeting.status === 'ongoing' ? (
                          <Badge variant="emerald" dot>Happening Now</Badge>
                        ) : (
                          <Badge variant="indigo">{meeting.time}</Badge>
                        )}
                        <span className="text-xs text-slate-400 font-medium">
                          Code: {meeting.code}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {meeting.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {meeting.description}
                      </p>

                      {/* Participants Avatar Stack */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex -space-x-2 overflow-hidden">
                          {meeting.participants.map((p, i) => (
                            <img
                              key={i}
                              src={p.avatar}
                              alt={p.name}
                              title={p.name}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-dark-card object-cover"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {meeting.participants.length} participants
                        </span>
                      </div>
                    </div>

                    {/* Join / Lobby Button */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={`/meetings/lobby/${meeting.id}`}>
                        <Button
                          variant={meeting.status === 'ongoing' ? 'primary' : 'outline'}
                          size="md"
                          rightIcon={ArrowRight}
                        >
                          {meeting.status === 'ongoing' ? 'Enter Room' : 'Join Lobby'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Items Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Pending Action Items
                </h2>
                <Badge size="sm" variant="amber">
                  {actions.filter((a) => !a.completed).length} pending
                </Badge>
              </div>
              <Link to="/ai/action-items" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                Manage All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <Card className="divide-y divide-slate-100 dark:divide-dark-border overflow-hidden">
              {actions.slice(0, 4).map((action) => (
                <div
                  key={action.id}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                    action.completed ? 'bg-slate-50/50 dark:bg-dark-surface/40 opacity-70' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={action.completed}
                      onChange={() => toggleAction(action.id)}
                      className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-dark-border cursor-pointer"
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          action.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {action.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        Extracted from: {action.meetingTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge
                      size="sm"
                      variant={
                        action.priority === 'Urgent'
                          ? 'rose'
                          : action.priority === 'High'
                          ? 'amber'
                          : 'indigo'
                      }
                    >
                      {action.priority}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Avatar src={action.assignee.avatar} name={action.assignee.name} size="xs" />
                      <span className="hidden sm:inline-block font-medium truncate max-w-[100px]">
                        {action.assignee.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>

        {/* Right Column (4 cols): AI Summary & Activity Stream */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Executive Summary Card */}
          <Card className="p-5 space-y-4 border-indigo-200/80 dark:border-indigo-900/50 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 dark:from-dark-card dark:via-dark-card dark:to-indigo-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Latest AI Executive Summary
              </span>
              <Badge size="sm" variant="emerald">98.4% Match</Badge>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {mockAiSummary.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Processed {mockAiSummary.generatedAt}
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {mockAiSummary.executiveSummary}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-dark-border flex items-center justify-between">
              <Link to="/ai/summaries" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                Full Summary & Transcript <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          {/* Quick AI Assistant Launcher */}
          <Card className="p-5 space-y-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <h3 className="text-sm font-bold">Ask IntellBot Assistant</h3>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Have questions about decisions made in previous meetings? IntellBot has indexed your entire history.
            </p>
            <Link to="/ai/assistant">
              <Button size="sm" variant="glass" className="w-full mt-2" rightIcon={ArrowRight}>
                Open AI Meeting Bot
              </Button>
            </Link>
          </Card>

          {/* Team Activity Feed */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Team Activity Feed
              </h3>
            </div>

            <div className="space-y-3">
              {mockActivityFeed.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-800 dark:text-slate-200">
                      <strong className="text-indigo-600 dark:text-indigo-400">{item.user}</strong> {item.action}{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">"{item.target}"</span>
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Join Meeting by Code Modal */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join Meeting by Code or Link"
        subtitle="Enter the meeting ID or direct room link"
      >
        <form onSubmit={handleJoinSubmit} className="space-y-4">
          <Input
            label="Meeting ID or Code"
            placeholder="e.g. INNOV-842-990 or meet-102"
            value={joinMeetingId}
            onChange={(e) => setJoinMeetingId(e.target.value)}
            helperText="You can also paste the full meeting invite URL"
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Join Lobby
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
