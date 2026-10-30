import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Video, Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';

export const SignUpPage = () => {
  const { signup, loading } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  // Registration form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate password strength score (0 to 4)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  // Return label and color based on strength score
  const getStrengthDisplay = () => {
    switch (strength) {
      case 0:
        return { label: 'Empty', color: 'bg-slate-200' };
      case 1:
        return { label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { label: 'Good', color: 'bg-indigo-500' };
      case 4:
        return { label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { label: 'Fair', color: 'bg-amber-500' };
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      newErrors.terms = 'You must accept the terms of service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      success('Account created! Please verify your email.');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      error(err.message || 'Failed to register account');
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
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sign up with any @gmail.com address or corporate email
          </p>
        </div>

        {/* Signup Form Card */}
        <Card className="p-8 sm:p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <Input
              label="Full Name"
              placeholder="e.g. Elena Rostova"
              leftIcon={User}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />

            {/* Work or Gmail Email */}
            <Input
              label="Work or Gmail Email"
              type="email"
              placeholder="you@gmail.com or name@enterprise.com"
              leftIcon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            {/* Password */}
            <div>
              <Input
                label="Password"
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Password strength:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {getStrengthDisplay().label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-dark-surface rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all duration-300 ${
                          strength >= step ? getStrengthDisplay().color : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-type password"
              leftIcon={Lock}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />

            {/* Terms of Service Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-dark-border"
                />
                <span>
                  I agree to the{' '}
                  <a href="#terms" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">
                    Enterprise Master Services Agreement
                  </a>{' '}
                  and acknowledge the{' '}
                  <a href="#privacy" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">
                    Privacy Statement
                  </a>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-4"
              isLoading={loading}
              rightIcon={ArrowRight}
            >
              Create Enterprise Account
            </Button>
          </form>

          {/* Already have an account link */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-dark-border text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already have an enterprise account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
