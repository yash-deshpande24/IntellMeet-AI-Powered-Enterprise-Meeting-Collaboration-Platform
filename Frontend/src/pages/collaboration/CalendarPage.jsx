import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockMeetings } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNotification } from '../../context/NotificationContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Video,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const CalendarPage = () => {
  const { info } = useNotification();
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [selectedDay, setSelectedDay] = useState(14);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate 35 calendar cells (October 2026 starts on Thursday)
  const calendarCells = [
    { day: 27, currentMonth: false },
    { day: 28, currentMonth: false },
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: false },
    { day: 1, currentMonth: true },
    { day: 2, currentMonth: true },
    { day: 3, currentMonth: true },
    { day: 4, currentMonth: true },
    { day: 5, currentMonth: true },
    { day: 6, currentMonth: true },
    { day: 7, currentMonth: true },
    { day: 8, currentMonth: true },
    { day: 9, currentMonth: true, hasMeeting: true, meetingTitle: 'Sprint 24 Architecture Sync' },
    { day: 10, currentMonth: true },
    { day: 11, currentMonth: true },
    { day: 12, currentMonth: true },
    { day: 13, currentMonth: true },
    { day: 14, currentMonth: true, hasMeeting: true, meetingTitle: 'Q3 Product Strategy' },
    { day: 15, currentMonth: true, hasMeeting: true, meetingTitle: 'Client Onboarding Call' },
    { day: 16, currentMonth: true },
    { day: 17, currentMonth: true },
    { day: 18, currentMonth: true },
    { day: 19, currentMonth: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true },
    { day: 24, currentMonth: true },
    { day: 25, currentMonth: true },
    { day: 26, currentMonth: true },
    { day: 27, currentMonth: true },
    { day: 28, currentMonth: true },
    { day: 29, currentMonth: true },
    { day: 30, currentMonth: true },
    { day: 31, currentMonth: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Meeting Calendar
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time schedule of synchronized video sessions, webinars, and reviews
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/meetings/schedule">
            <Button variant="primary" size="sm" leftIcon={PlusCircle}>
              Schedule Meeting
            </Button>
          </Link>
        </div>
      </div>

      {/* Month Bar */}
      <Card className="p-4 flex items-center justify-between border-slate-200/80 dark:border-dark-border">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {currentMonth}
          </h2>
          <Badge variant="indigo" size="sm">3 Scheduled</Badge>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => info('Browsed previous month')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-surface"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => info('Reset to current date')}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-dark-surface text-slate-700 dark:text-slate-300"
          >
            Today
          </button>
          <button
            onClick={() => info('Browsed next month')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-surface"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card className="overflow-hidden shadow-xl border-slate-200/80 dark:border-dark-border">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-center py-2.5">
          {daysOfWeek.map((day) => (
            <span key={day} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-dark-border">
          {calendarCells.map((cell, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (cell.currentMonth) setSelectedDay(cell.day);
              }}
              className={`min-h-[95px] p-2 sm:p-2.5 transition-colors cursor-pointer flex flex-col justify-between ${
                !cell.currentMonth
                  ? 'bg-slate-50/40 dark:bg-dark-surface/20 text-slate-400'
                  : selectedDay === cell.day
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/30'
                  : 'hover:bg-slate-50 dark:hover:bg-dark-surface/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                    selectedDay === cell.day
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cell.day}
                </span>
              </div>

              {cell.hasMeeting && (
                <div className="mt-1 p-1 sm:p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 truncate">
                  <div className="flex items-center gap-1">
                    <Video className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="truncate">{cell.meetingTitle}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
