import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNotification } from '../../context/NotificationContext';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  Star,
  CheckCircle2,
  Share2,
  Calendar,
  Home,
  FileText,
} from 'lucide-react';

export const MeetingEndedPage = () => {
  const { id } = useParams();
  const { success } = useNotification();
  const [rating, setRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleRate = (stars) => {
    setRating(stars);
    setFeedbackSubmitted(true);
    success('Thank you! Meeting audio quality metrics logged.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="max-w-xl w-full space-y-6">
        <Card className="p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-800 shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="indigo" size="sm">Conference Concluded</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              You Have Left the Meeting
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Sprint 24 Architecture & WebRTC Sync (ID: {id || 'meet-102'})
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-center">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Duration</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                48 min
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Attendees</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                4 People
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">AI Digest</p>
              <p className="text-base font-extrabold text-emerald-500 mt-0.5">
                Ready ✨
              </p>
            </div>
          </div>

          {/* Rate Call Quality */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              How was your audio & video stream quality?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            {feedbackSubmitted && (
              <p className="text-xs text-emerald-500 font-semibold animate-fade-in">
                Quality feedback saved!
              </p>
            )}
          </div>

          {/* Key Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link to="/ai/summaries" className="flex-1">
              <Button variant="gradient" size="md" className="w-full" leftIcon={Sparkles} rightIcon={ArrowRight}>
                View AI Summary
              </Button>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <Button variant="outline" size="md" className="w-full" leftIcon={Home}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
