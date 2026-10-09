import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Video, Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

export const ResetPasswordPage = () => {
  const { resetPassword, loading } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!code.trim()) errs.code = 'Security code is required';
    if (!password) {
      errs.password = 'New password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await resetPassword(password);
      success('Password successfully reset! Please sign in with your new credentials.');
      navigate('/login');
    } catch (err) {
      error(err.message || 'Password reset failed');
    }
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
            Create New Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Enter the recovery code from your email and choose a strong new password
          </p>
        </div>

        <Card className="p-8 sm:p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="6-Digit Verification Code"
              placeholder="e.g. 849201"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code}
            />

            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
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
            />

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              leftIcon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={ArrowRight}
            >
              Update Password & Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-dark-border text-center">
            <Link to="/login" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600">
              Remembered your credentials? Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
