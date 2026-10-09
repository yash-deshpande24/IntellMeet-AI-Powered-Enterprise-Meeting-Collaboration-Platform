import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { mockTeamMembers, mockActivityFeed } from '../../data/mockData';
import {
  Layers,
  Users,
  ShieldCheck,
  FolderOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  HardDrive,
  Globe,
  Settings,
} from 'lucide-react';

export const WorkspaceOverview = () => {
  const stats = [
    { label: 'Active Members', value: '48 Users', icon: Users, color: 'indigo' },
    { label: 'Cloud Storage Used', value: '142.8 GB / 1 TB', icon: HardDrive, color: 'purple' },
    { label: 'AI Summaries Run', value: '98 Processed', icon: Sparkles, color: 'emerald' },
    { label: 'Security Level', value: 'SOC2 Type II Active', icon: ShieldCheck, color: 'amber' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              InnovateCorp Workspace Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise collaboration hub, team members, shared assets, and access governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/workspace/members">
            <Button variant="primary" size="sm" leftIcon={Users}>
              Manage Team
            </Button>
          </Link>
          <Link to="/settings/workspace">
            <Button variant="outline" size="sm" leftIcon={Settings}>
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
                  {s.label}
                </p>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
                  {s.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Team Directory Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Team Directory Highlights
            </h2>
            <Link to="/workspace/members" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View All 48 Members <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="divide-y divide-slate-100 dark:divide-dark-border overflow-hidden">
            {mockTeamMembers.slice(0, 5).map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={m.avatar} name={m.name} size="md" status="online" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {m.department} • {m.email}
                    </p>
                  </div>
                </div>

                <Badge
                  size="sm"
                  variant={m.role === 'Owner' ? 'purple' : m.role === 'Admin' ? 'indigo' : 'slate'}
                >
                  {m.role}
                </Badge>
              </div>
            ))}
          </Card>
        </div>

        {/* Right Column (5 cols): Activity Feed & Policies */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Recent Workspace Events
            </h3>

            <div className="space-y-3">
              {mockActivityFeed.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-800 dark:text-slate-200 leading-snug">
                      <strong className="text-indigo-600 dark:text-indigo-400">{item.user}</strong> {item.action}{' '}
                      <span className="font-semibold text-slate-900 dark:text-white">"{item.target}"</span>
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 space-y-3 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-dark-card dark:to-indigo-950/30 border-indigo-200 dark:border-indigo-900/40">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Enterprise Workspace Plan
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Domain whitelist active: <code className="text-indigo-600 dark:text-indigo-400 font-mono">@innovatecorp.com</code>. Anyone with a verified company domain can join automatically.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
