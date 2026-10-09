import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import {
  Video,
  LayoutDashboard,
  Calendar,
  Sparkles,
  FileText,
  CheckSquare,
  Users,
  FolderOpen,
  Settings,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  PlusCircle,
  VideoOff,
  History,
  Bot,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { info } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navGroups = [
    {
      title: 'Core Platform',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Meetings', icon: Video, path: '/meetings', badge: '1 Live' },
        { label: 'Schedule Meeting', icon: PlusCircle, path: '/meetings/schedule' },
        { label: 'Join Room', icon: ExternalLink, path: '/meetings/join' },
        { label: 'Meeting History', icon: History, path: '/meetings/history' },
      ],
    },
    {
      title: 'AI Intelligence',
      items: [
        { label: 'AI Summaries', icon: Sparkles, path: '/ai/summaries' },
        { label: 'Smart Transcripts', icon: FileText, path: '/ai/transcripts' },
        { label: 'Action Items', icon: CheckSquare, path: '/ai/action-items', badge: '3 Due' },
        { label: 'IntellBot Assistant', icon: Bot, path: '/ai/assistant' },
      ],
    },
    {
      title: 'Collaboration',
      items: [
        { label: 'Workspace Hub', icon: Layers, path: '/workspace' },
        { label: 'Team Members', icon: Users, path: '/workspace/members' },
        { label: 'Shared Files', icon: FolderOpen, path: '/workspace/files' },
        { label: 'Calendar', icon: Calendar, path: '/workspace/calendar' },
      ],
    },
    {
      title: 'Enterprise Settings',
      items: [
        { label: 'My Profile', icon: Avatar, path: '/settings/profile', isAvatar: true },
        { label: 'Preferences & Devices', icon: Settings, path: '/settings/preferences' },
        { label: 'Security & 2FA', icon: Shield, path: '/settings/security' },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    info('Logged out successfully');
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      info(`Searching workspace for "${searchQuery}"`);
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card transition-all duration-300 z-30 sticky top-0 h-screen ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-dark-border">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <Video className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-700 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent truncate block">
                  IntellMeet
                </span>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                  InnovateCorp
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-surface"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Quick Instant Meeting Button */}
        {!sidebarCollapsed ? (
          <div className="p-3 border-b border-slate-100 dark:border-dark-border">
            <Link to="/meetings/lobby/meet-102">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm hover:shadow-glow-primary transition-all">
                <Video className="w-4 h-4" />
                <span>Launch Instant Room</span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="p-2 border-b border-slate-100 dark:border-dark-border flex justify-center">
            <Link to="/meetings/lobby/meet-102" title="Launch Instant Room">
              <button className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm">
                <Video className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold border border-indigo-200/50 dark:border-indigo-800/50'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-surface'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 flex-shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <Badge
                        size="sm"
                        variant={item.badge.includes('Live') ? 'emerald' : 'indigo'}
                        dot={item.badge.includes('Live')}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Workspace Profile Card */}
        <div className="p-3 border-t border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-surface/50">
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar} name={user?.name} size="sm" status="online" />
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.role || 'Product Lead'}
                </p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border h-full flex flex-col z-10 animate-slide-up">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Video className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  IntellMeet
                </span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
              {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {group.title}
                  </div>
                  {group.items.map((item) => {
                    const IconComponent = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                          active
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-surface'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && <Badge size="sm">{item.badge}</Badge>}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-dark-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Enterprise</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 h-16 glass-nav border-b border-slate-200/80 dark:border-dark-border px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-surface"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Enterprise Workspace / </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 capitalize">
                {location.pathname.replace('/', '').replace(/-/g, ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search meetings, transcripts, action items, or team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-100/80 dark:bg-dark-surface border border-slate-200/60 dark:border-dark-border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </form>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Schedule Button */}
            <Link to="/meetings/schedule" className="hidden sm:inline-flex">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60 transition-colors">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Schedule</span>
              </button>
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-surface"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-surface"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-dark-card" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-slate-200 dark:border-dark-border py-2 z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-dark-border flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline">
                      Mark all read
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-dark-border max-h-72 overflow-y-auto">
                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-dark-surface/60 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                          AI Executive Summary Ready
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-4">
                        IntellBot generated the summary for Design System Critique.
                      </p>
                      <span className="text-[10px] text-slate-400 pl-4 block mt-0.5">10m ago</span>
                    </div>

                    <div className="p-3 hover:bg-slate-50 dark:hover:bg-dark-surface/60 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                          Upcoming Meeting in 30 Min
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-4">
                        Q3 Product Strategy starts at 02:30 PM.
                      </p>
                      <span className="text-[10px] text-slate-400 pl-4 block mt-0.5">25m ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-surface transition-colors focus:outline-none"
              >
                <Avatar src={user?.avatar} name={user?.name} size="sm" status="online" />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-slate-200 dark:border-dark-border py-2 z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-dark-border">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                    <Badge size="sm" variant="indigo" className="mt-1.5">
                      {user?.plan || 'Enterprise AI'}
                    </Badge>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/settings/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-surface"
                    >
                      <Avatar name={user?.name} size="xs" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/settings/preferences"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-surface"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Preferences & Audio</span>
                    </Link>
                    <Link
                      to="/settings/security"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-surface"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Security & 2FA</span>
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-slate-100 dark:border-dark-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border-t border-slate-200 dark:border-dark-border z-30 px-2 py-1.5 flex items-center justify-around">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-semibold ${
            isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/meetings"
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-semibold ${
            isActive('/meetings') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Meetings</span>
        </Link>
        <Link
          to="/meetings/lobby/meet-102"
          className="flex flex-col items-center p-1.5 rounded-full bg-indigo-600 text-white -mt-5 shadow-lg border-2 border-white dark:border-dark-bg"
        >
          <Video className="w-5 h-5 p-0.5" />
        </Link>
        <Link
          to="/ai/summaries"
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-semibold ${
            isActive('/ai') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Intel</span>
        </Link>
        <Link
          to="/workspace"
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-semibold ${
            isActive('/workspace') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team</span>
        </Link>
      </nav>
    </div>
  );
};
