import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Video, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});

  // Route destination after successful login
  const from = location.state?.from?.pathname || '/dashboard';

  // Basic form validation
  const validateForm = () => {
    const newErrors = {};
    const isGmail = email.trim().toLowerCase().endsWith('@gmail.com');

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!isGmail) {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit login credentials
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const isGmail = email.trim().toLowerCase().endsWith('@gmail.com');
    const effectivePassword = password || (isGmail ? 'password123' : '');

    try {
      await login(email, effectivePassword, rememberMe);
      success('Welcome back to IntellMeet Enterprise!');
      navigate(from, { replace: true });
    } catch (err) {
      error(err.message || 'Failed to authenticate');
    }
  };

  // 1-Click demo login for instant testing
  const handleDemoLogin = async () => {
    const demoEmail = 'alex.vance@innovatecorp.com';
    const demoPassword = 'Password123!';
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      await login(demoEmail, demoPassword, true);
      success('Logged in with Demo Profile');
      navigate(from, { replace: true });
    } catch (err) {
      error('Demo login failed');
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
            Sign In to Enterprise Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Access with any @gmail.com account or enterprise credentials
          </p>
        </div>

        {/* 1-Click Demo & Open Access Login Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div className="truncate">
              <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Open Access &amp; Evaluation
              </p>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300 truncate">
                Any @gmail.com email accepted | Admin: admin@intellmeet.io
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setEmail('user@gmail.com');
                setPassword('password123');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold transition-colors"
              title="Fill Gmail Demo (user@gmail.com)"
            >
              Gmail Fill
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@intellmeet.io');
                setPassword('password123');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/60 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-semibold transition-colors"
              title="Fill Admin Credentials (password123)"
            >
              Admin Fill
            </button>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              1-Click Demo
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="p-8 sm:p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <Input
              label="Work or Gmail Address"
              type="email"
              placeholder="you@gmail.com or name@company.com"
              leftIcon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            {/* Password Input */}
            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                leftIcon={Lock}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="current-password"
              />

              {/* Remember Me & Forgot Password Links */}
              <div className="flex items-center justify-between mt-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-dark-border"
                  />
                  <span>Remember this device</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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
              Sign In to Workspace
            </Button>
          </form>

          {/* Sign Up Redirect Link */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-dark-border text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Don't have an enterprise account yet?{' '}
              <Link to="/signup" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Create one free
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
