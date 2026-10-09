import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useMeeting } from '../context/MeetingContext';
import { Video, ShieldCheck, Radio, X } from 'lucide-react';

export const MeetingLayout = () => {
  const { isRecording } = useMeeting();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white select-none overflow-hidden">
      {/* Sleek Meeting Header */}
      <header className="h-14 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex items-center justify-between z-30">
        {/* Left: Brand & Meeting Info */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Video className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight hidden sm:inline-block">
              IntellMeet
            </span>
          </Link>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300 truncate max-w-[200px] sm:max-w-xs">
              Sprint 24 Architecture Sync
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-3 h-3" /> E2EE AES-256
            </span>
          </div>
        </div>

        {/* Center: Live / Recording Status */}
        <div className="hidden md:flex items-center gap-3">
          {isRecording ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-xs font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>REC 00:24:18</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>HD 1080p • 60 FPS</span>
            </div>
          )}
        </div>

        {/* Right: Quick Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Room"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Meeting Screen Body */}
      <main className="flex-1 relative flex flex-col overflow-hidden bg-slate-950">
        <Outlet />
      </main>
    </div>
  );
};
