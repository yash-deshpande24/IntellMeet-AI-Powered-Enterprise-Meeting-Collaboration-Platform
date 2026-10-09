import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { User, Mail, Building, Globe, Camera, CheckCircle2, Shield } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { success } = useNotification();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Vance',
    email: user?.email || 'alex.vance@innovatecorp.com',
    role: user?.role || 'Product VP & Workspace Admin',
    timezone: user?.timezone || 'America/New_York (GMT-4)',
    bio: 'Leading product design and collaboration AI infrastructure at InnovateCorp.',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((res) => setTimeout(res, 600));
    updateProfile(formData);
    setSaving(false);
    success('Profile information successfully saved!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Personal Profile & Identity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your enterprise profile, contact credentials, and timezone preferences
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200/80 dark:border-dark-border">
        {/* Avatar Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100 dark:border-dark-border">
          <div className="relative group">
            <Avatar src={user?.avatar} name={formData.name} size="xl" status="online" />
            <button
              type="button"
              onClick={() => success('Photo picker opened (simulated)')}
              className="absolute inset-0 bg-slate-900/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {formData.name}
            </h2>
            <p className="text-xs text-slate-500">{formData.role}</p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="indigo" size="sm">Workspace Admin</Badge>
              <Badge variant="emerald" size="sm">SSO Verified</Badge>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              leftIcon={User}
            />

            <Input
              label="Work Email (Managed via SSO)"
              value={formData.email}
              disabled
              leftIcon={Mail}
              helperText="Managed by corporate Single Sign-On"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Role & Title"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              leftIcon={Building}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Primary Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="America/New_York (GMT-4)">America/New_York (GMT-4)</option>
                <option value="America/Los_Angeles (GMT-7)">America/Los_Angeles (GMT-7)</option>
                <option value="Europe/London (GMT+1)">Europe/London (GMT+1)</option>
                <option value="Asia/Tokyo (GMT+9)">Asia/Tokyo (GMT+9)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Bio / Team Status
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full text-xs rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              rightIcon={CheckCircle2}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
