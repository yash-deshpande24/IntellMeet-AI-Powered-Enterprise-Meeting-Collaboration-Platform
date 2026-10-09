import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Video, Mail, CheckCircle2, ArrowRight, RotateCw } from 'lucide-react';

export const VerifyEmailPage = () => {
  const { verifyEmail, loading, user } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || user?.email || 'alex.vance@innovatecorp.com';
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split('');
      const newDigits = [...digits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setDigits(newDigits);
      if (inputRefs.current[Math.min(pasted.length, 5)]) {
        inputRefs.current[Math.min(pasted.length, 5)].focus();
      }
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-advance
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      error('Please enter all 6 verification digits');
      return;
    }

    try {
      await verifyEmail(code);
      success('Email successfully verified! Welcome to IntellMeet.');
      navigate('/dashboard');
    } catch (err) {
      error(err.message || 'Verification failed');
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
    success(`Verification code re-sent to ${email}`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              IntellMeet
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            We sent a 6-digit confirmation code to{' '}
            <strong className="text-slate-800 dark:text-slate-200">{email}</strong>
          </p>
        </div>

        <Card className="p-8 sm:p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 Digit Inputs */}
            <div className="flex justify-between gap-2 sm:gap-3">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-xl font-extrabold rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              isLoading={loading}
              rightIcon={ArrowRight}
            >
              Verify & Launch Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs text-slate-500">
            <span>Didn't get the code?</span>
            {countdown > 0 ? (
              <span className="font-semibold text-slate-400">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" /> Resend Code
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
