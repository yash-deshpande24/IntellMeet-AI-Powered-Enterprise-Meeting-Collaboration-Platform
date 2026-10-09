import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { useNotification } from '../../context/NotificationContext';
import {
  Layers,
  Shield,
  Building,
  Globe,
  Lock,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const WorkspaceSettingsPage = () => {
  const { success } = useNotification();
  const [workspaceName, setWorkspaceName] = useState('InnovateCorp Enterprise');
  const [allowedDomains, setAllowedDomains] = useState('innovatecorp.com, innovate-labs.io');
  const [dataRetention, setDataRetention] = useState('90');
  const [requireE2EE, setRequireE2EE] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    success('Workspace governance settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Enterprise Workspace Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure tenant domains, recording retention policies, and cryptographic security defaults
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200/80 dark:border-dark-border">
        <form onSubmit={handleSave} className="space-y-6">
          <Input
            label="Workspace Organization Name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            leftIcon={Building}
          />

          <Input
            label="Authorized Email Domains (Auto-Join Whitelist)"
            value={allowedDomains}
            onChange={(e) => setAllowedDomains(e.target.value)}
            leftIcon={Globe}
            helperText="Employees with these corporate email domains will join without manual approval."
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Cloud Recording & AI Transcript Data Retention
            </label>
            <select
              value={dataRetention}
              onChange={(e) => setDataRetention(e.target.value)}
              className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="30">30 Days (Automated Purge)</option>
              <option value="90">90 Days (SOC2 Standard Recommendation)</option>
              <option value="365">1 Year (Long Term Archive)</option>
              <option value="forever">Indefinite Retention</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Enforce End-to-End Encryption (AES-256) by Default
              </p>
              <p className="text-[11px] text-slate-500">
                Prevents unencrypted peer connections across all generated meeting codes.
              </p>
            </div>
            <input
              type="checkbox"
              checked={requireE2EE}
              onChange={(e) => setRequireE2EE(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" rightIcon={CheckCircle2}>
              Save Workspace Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
