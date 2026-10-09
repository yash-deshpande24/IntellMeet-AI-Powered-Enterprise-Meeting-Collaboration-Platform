import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useNotification } from '../../context/NotificationContext';
import { Video, ArrowRight, ArrowLeft, ShieldCheck, Keyboard, Radio } from 'lucide-react';

export const JoinMeetingPage = () => {
  const [meetingCode, setMeetingCode] = useState('');
  const [name, setName] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const { error } = useNotification();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!meetingCode.trim()) {
      setErrorText('Please provide a meeting code or room URL');
      return;
    }
    setErrorText('');

    // Extract ID if URL pasted
    let cleanCode = meetingCode.trim();
    if (cleanCode.includes('/')) {
      cleanCode = cleanCode.split('/').pop();
    }

    navigate(`/meetings/lobby/${cleanCode}`);
  };

  const sampleCodes = ['INNOV-842-990', 'AI-CORE-771-02', 'UX-SYNC-554-19'];

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link
          to="/meetings"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-surface"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Join Enterprise Meeting
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Enter meeting code or paste invite link to proceed to the pre-call lobby
          </p>
        </div>
      </div>

      <Card className="p-8 sm:p-10 shadow-xl space-y-6">
        <form onSubmit={handleJoin} className="space-y-5">
          <Input
            label="Meeting Code or Invite URL *"
            placeholder="e.g. INNOV-842-990 or meet-102"
            leftIcon={Keyboard}
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
            error={errorText}
            autoFocus
          />

          <Input
            label="Display Name (Optional)"
            placeholder="e.g. Alex Vance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="Leave empty to use your default enterprise profile name"
          />

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            rightIcon={ArrowRight}
          >
            Enter Pre-Meeting Lobby
          </Button>
        </form>

        {/* Quick Demo Rooms */}
        <div className="pt-4 border-t border-slate-100 dark:border-dark-border space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Quick Demo Rooms Available:
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleCodes.map((code) => (
              <button
                key={code}
                onClick={() => setMeetingCode(code)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-surface hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors border border-slate-200/60 dark:border-dark-border"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200/60 dark:border-dark-border flex items-center gap-2.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>All connections are secured with end-to-end cryptographic media verification.</span>
        </div>
      </Card>
    </div>
  );
};
