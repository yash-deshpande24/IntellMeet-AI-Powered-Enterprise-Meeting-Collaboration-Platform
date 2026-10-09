import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { useNotification } from '../../context/NotificationContext';
import {
  ShieldCheck,
  Key,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  LogOut,
} from 'lucide-react';

export const SecuritySettingsPage = () => {
  const { success, info } = useNotification();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');

  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'MacBook Pro 16" (Sonoma 14.6)',
      location: 'New York, USA',
      ip: '192.88.99.12',
      current: true,
      lastActive: 'Active Now',
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro Max (iOS 18.1)',
      location: 'New York, USA',
      ip: '192.88.99.88',
      current: false,
      lastActive: '2 hours ago',
    },
  ]);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      setPassError('All password fields are required');
      return;
    }
    if (newPass.length < 8) {
      setPassError('New password must be at least 8 characters');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match');
      return;
    }
    setPassError('');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    success('Password updated successfully across all enterprise devices.');
  };

  const handleRevokeSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
    info('Device session revoked');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Enterprise Security & 2FA Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Cryptographic keys, multi-factor authentication, and authenticated active sessions
        </p>
      </div>

      {/* Two-Factor Authentication Card */}
      <Card className="p-6 sm:p-8 space-y-5 shadow-xl border-slate-200/80 dark:border-dark-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Two-Factor Authentication (2FA)
              </h2>
              <p className="text-xs text-slate-500">
                Requires a 6-digit TOTP authenticator code upon signing into new devices.
              </p>
            </div>
          </div>

          <Badge variant={twoFactorEnabled ? 'emerald' : 'rose'} size="md">
            {twoFactorEnabled ? 'Enforced & Active' : 'Disabled'}
          </Badge>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Hardware Security Key / Google Authenticator
            </p>
            <p className="text-[11px] text-slate-500">
              Paired with Authenticator App (Key ID: intell_totp_8402)
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              success(`2FA ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
            }}
          >
            {twoFactorEnabled ? 'Reconfigure' : 'Enable 2FA'}
          </Button>
        </div>
      </Card>

      {/* Change Password Card */}
      <Card className="p-6 sm:p-8 space-y-5 shadow-xl border-slate-200/80 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Change Master Password
          </h2>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••••••"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
          />

          <Input
            label="New Strong Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-type new password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          {passError && (
            <p className="text-xs text-rose-500 font-medium">{passError}</p>
          )}

          <Button type="submit" variant="primary" size="md">
            Update Password
          </Button>
        </form>
      </Card>

      {/* Active Login Sessions Card */}
      <Card className="p-6 sm:p-8 space-y-4 shadow-xl border-slate-200/80 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <Laptop className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Active Device Sessions
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-dark-border">
          {sessions.map((sess) => (
            <div key={sess.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-dark-surface text-slate-600 dark:text-slate-300">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {sess.device}
                    {sess.current && <Badge size="sm" variant="emerald">Current Session</Badge>}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {sess.location} • IP: {sess.ip} • {sess.lastActive}
                  </p>
                </div>
              </div>

              {!sess.current && (
                <button
                  onClick={() => handleRevokeSession(sess.id)}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Revoke Access
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
