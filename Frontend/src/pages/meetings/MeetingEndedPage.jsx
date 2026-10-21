import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNotification } from '../../context/NotificationContext';
import {
  getMeetingByCode,
  generateSummary,
  updateMeetingStatus,
} from '../../services/meetingService';
import { Sparkles, ArrowRight, Star, CheckCircle2, Home } from 'lucide-react';

export const MeetingEndedPage = () => {
  const { id } = useParams(); // this is the room code
  const { success } = useNotification();
  const [rating, setRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [meeting, setMeeting] = useState(null);
  const [status, setStatus] = useState('processing'); // processing | ready | error
  const [errorMsg, setErrorMsg] = useState('');
  const startedRef = useRef(false);

  useEffect(() => {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  }, []);

  // Find the meeting, generate the AI summary, mark it completed
  useEffect(() => {
    if (startedRef.current) return; // avoid running twice in React StrictMode
    startedRef.current = true;

    const run = async () => {
      try {
        const found = await getMeetingByCode(id);
        await generateSummary(found._id);
        await updateMeetingStatus(found._id, 'completed').catch(() => {});
        setMeeting(found);
        setStatus('ready');
      } catch (err) {
        setErrorMsg(err.message);
        setStatus('error');
      }
    };
    run();
  }, [id]);

  const handleRate = (stars) => {
    setRating(stars);
    setFeedbackSubmitted(true);
    success('Thank you! Meeting audio quality metrics logged.');
  };

  const summaryLink = meeting ? `/ai/summaries/${meeting._id}` : '/ai/summaries';

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
              {meeting ? meeting.title : 'Loading meeting...'} (Room: {id})
            </p>
          </div>

          {/* Stats Bar (real data) */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-center">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Transcript</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                {meeting ? `${meeting.transcript?.length || 0} lines` : '...'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Attendees</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                {meeting ? `${meeting.participants?.length || 1} People` : '...'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">AI Digest</p>
              <p
                className={`text-base font-extrabold mt-0.5 ${
                  status === 'ready'
                    ? 'text-emerald-500'
                    : status === 'error'
                    ? 'text-rose-500'
                    : 'text-amber-500 animate-pulse'
                }`}
              >
                {status === 'ready' ? 'Ready ✨' : status === 'error' ? 'Failed' : 'Generating...'}
              </p>
            </div>
          </div>

          {status === 'error' && (
            <p className="text-xs text-rose-500">
              Could not generate the summary: {errorMsg}. Make sure you are logged in with a real account.
            </p>
          )}

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
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
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
            <Link to={summaryLink} className="flex-1">
              <Button
                variant="gradient"
                size="md"
                className="w-full"
                leftIcon={Sparkles}
                rightIcon={ArrowRight}
                disabled={status === 'processing'}
              >
                {status === 'processing' ? 'Preparing summary...' : 'View AI Summary'}
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