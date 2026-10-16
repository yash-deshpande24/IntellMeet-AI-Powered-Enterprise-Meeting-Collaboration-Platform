import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Video, ArrowRight, RotateCw } from 'lucide-react';

export const VerifyEmailPage = () => {
  const { verifyEmail, loading, user } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user email from route state or context fallback
  const userEmail = location.state?.email || user?.email || 'user@example.com';

  // 6-digit OTP code state
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const inputRefs = useRef([]);

  // Countdown timer effect for resend button
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle digit input change and auto-focus next input
  const handleDigitChange = (index, value) => {
    // Check if user pasted multiple characters
    if (value.length > 1) {
      const pastedChars = value.slice(0, 6).split('');
      const updatedDigits = [...digits];

      pastedChars.forEach((char, i) => {
        if (i < 6) updatedDigits[i] = char;
      });

      setDigits(updatedDigits);

      // Focus the next empty or last input
      const targetIndex = Math.min(pastedChars.length, 5);
      if (inputRefs.current[targetIndex]) {
        inputRefs.current[targetIndex].focus();
      }
      return;
    }

    // Single digit entry
    const updatedDigits = [...digits];
    updatedDigits[index] = value;
    setDigits(updatedDigits);

    // Auto-advance cursor to next input box
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace navigation to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Form submission to verify code
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = digits.join('');

    if (fullCode.length < 6) {
      error('Please enter all 6 digits of the verification code.');
      return;
    }

    try {
      await verifyEmail(fullCode);
      success('Email verified successfully! Welcome to IntellMeet.');
      navigate('/dashboard');
    } catch (err) {
      error(err.message || 'Verification failed. Please try again.');
    }
  };

  // Resend verification code
  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
    success(`A new verification code has been sent to ${userEmail}`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Header with App Logo and Title */}
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
            <strong className="text-slate-800 dark:text-slate-200">{userEmail}</strong>
          </p>
        </div>

        {/* Verification Card */}
        <Card className="p-8 sm:p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 Digit Input Boxes */}
            <div className="flex justify-between gap-2 sm:gap-3">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-extrabold rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Submit Button */}
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

          {/* Resend Code Section */}
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
