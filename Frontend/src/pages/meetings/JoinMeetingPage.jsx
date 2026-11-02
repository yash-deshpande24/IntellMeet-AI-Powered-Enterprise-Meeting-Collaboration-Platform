import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useNotification } from '../../context/NotificationContext';
import { Video, ArrowRight, ArrowLeft, ShieldCheck, Keyboard, Lock } from 'lucide-react';

export const JoinMeetingPage = () => {
  const [meetingInput, setMeetingInput] = useState('');
  const [passcode, setPasscode] = useState('');
  const [name, setName] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const { error } = useNotification();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!meetingInput.trim()) {
      setErrorText('Please provide a meeting code or invite URL');
      return;
    }
    setErrorText('');

    let rawInput = meetingInput.trim();
    let roomCode = rawInput;
    let extractedPwd = passcode.trim();

    // If a full URL was pasted (e.g. http://localhost:5173/meetings/lobby/int-xxx?pwd=123456)
    if (rawInput.includes('/')) {
      try {
        const urlObj = new URL(rawInput, window.location.origin);
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        roomCode = pathSegments[pathSegments.length - 1] || rawInput;
        const urlPwd = urlObj.searchParams.get('pwd');
        if (urlPwd && !extractedPwd) {
          extractedPwd = urlPwd;
        }
      } catch {
        const lastPart = rawInput.split('/').pop() || '';
        if (lastPart.includes('?')) {
          const [code, query] = lastPart.split('?');
          roomCode = code;
          const params = new URLSearchParams(query);
          if (params.get('pwd') && !extractedPwd) {
            extractedPwd = params.get('pwd');
          }
        } else {
          roomCode = lastPart;
        }
      }
    }

    const targetUrl = `/meetings/lobby/${roomCode}${extractedPwd ? `?pwd=${encodeURIComponent(extractedPwd)}` : ''}`;
    navigate(targetUrl);
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
            placeholder="e.g. int-abc-def-ghi or paste 1-click link"
            leftIcon={Keyboard}
            value={meetingInput}
            onChange={(e) => setMeetingInput(e.target.value)}
            error={errorText}
            autoFocus
          />

          <Input
            label="Security Passcode (If required)"
            placeholder="e.g. 6-digit PIN from invitation email"
            leftIcon={Lock}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            helperText="Not needed if joining through a 1-click invite link with embedded credentials."
          />

          <Input
            label="Display Name (Optional)"
            placeholder="e.g. Alex Vance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="Leave empty to use your current profile name"
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
                onClick={() => setMeetingInput(code)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-surface hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors border border-slate-200/60 dark:border-dark-border"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
