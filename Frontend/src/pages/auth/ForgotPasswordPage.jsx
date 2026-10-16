import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Video, Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { forgotPassword, loading } = useAuth();
  const { success, error } = useNotification();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Handle forgot password request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setFormError('Please enter a valid business email');
      return;
    }
    setFormError('');

    try {
      await forgotPassword(email);
      setSubmitted(true);
      success('Password reset instructions sent to your email.');
    } catch (err) {
      error(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Brand Header */}
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
            Reset Enterprise Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Enter your work email address and we'll send a secure password reset link
          </p>
        </div>

        {/* Card Body */}
        <Card className="p-8 sm:p-10 shadow-xl">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Check Your Inbox
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We've sent a 6-digit verification code and reset link to <strong className="text-slate-900 dark:text-white">{email}</strong>.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/reset-password">
                  <Button variant="primary" className="w-full" rightIcon={ArrowRight}>
                    Enter Reset Code
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-slate-500 hover:underline"
                >
                  Didn't receive email? Try again
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Registered Work Email"
                type="email"
                placeholder="name@enterprise.com"
                leftIcon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={formError}
              />

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                isLoading={loading}
                rightIcon={ArrowRight}
              >
                Send Recovery Link
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-dark-border text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
