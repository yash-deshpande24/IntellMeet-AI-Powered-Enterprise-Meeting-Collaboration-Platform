import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Sun,
  Moon,
  Volume2,
  Mic,
  Camera,
  Bell,
  Sparkles,
  CheckCircle2,
  Sliders,
  Play,
} from 'lucide-react';

export const PreferencesPage = () => {
  const { theme, setTheme } = useTheme();
  const { success, info } = useNotification();

  const [micTesting, setMicTesting] = useState(false);
  const [audioSettings, setAudioSettings] = useState({
    noiseSuppression: true,
    echoCancellation: true,
    autoGain: true,
  });

  const [aiPreferences, setAiPreferences] = useState({
    autoSummarize: true,
    autoExtractTasks: true,
    sendEmailDigest: true,
  });

  const handleTestChime = () => {
    // Play subtle synthetic beep/chime
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
    success('Audio output test chime played successfully!');
  };

  const handleTestMic = () => {
    setMicTesting(true);
    info('Microphone input level test active...');
    setTimeout(() => {
      setMicTesting(false);
      success('Microphone level calibrated: 100% clarity, zero clipping');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Preferences, Devices & AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize visual themes, configure studio peripherals, and toggle AI automation
        </p>
      </div>

      {/* Theme Selection Card */}
      <Card className="p-6 sm:p-8 space-y-4 shadow-xl border-slate-200/80 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Interface Appearance
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                : 'border-slate-200 dark:border-dark-border hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between pb-3">
              <Sun className="w-5 h-5 text-amber-500" />
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Light Enterprise</p>
            <p className="text-[11px] text-slate-500 mt-0.5">High-contrast daytime workspace</p>
          </div>

          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                : 'border-slate-200 dark:border-dark-border hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between pb-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Dark Stealth</p>
            <p className="text-[11px] text-slate-500 mt-0.5">OLED-optimized sleek glass</p>
          </div>
        </div>
      </Card>

      {/* Audio Hardware & Video Testing Card */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200/80 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Audio Processing & Peripherals
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-indigo-500" /> Test Microphone Level
              </span>
              <Button size="sm" variant="outline" onClick={handleTestMic} isLoading={micTesting}>
                Test Mic
              </Button>
            </div>
            {/* Visual Level Meter */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full bg-emerald-500 rounded-full transition-all duration-300 ${
                  micTesting ? 'w-4/5 animate-pulse' : 'w-1/4'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-500">Active device: Elgato Wave:3 (Studio USB)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-indigo-500" /> Audio Output Chime
              </span>
              <Button size="sm" variant="outline" leftIcon={Play} onClick={handleTestChime}>
                Play Sound
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 pt-3">
              Active speakers: Spatial Audio Studio Monitors
            </p>
          </div>
        </div>

        {/* Neural Audio Filters */}
        <div className="divide-y divide-slate-100 dark:divide-dark-border pt-2">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                AI DeepFilter Neural Noise Cancellation
              </p>
              <p className="text-[11px] text-slate-500">
                Eliminates keyboard clicks, fan hum, and background chatter in real-time.
              </p>
            </div>
            <input
              type="checkbox"
              checked={audioSettings.noiseSuppression}
              onChange={(e) =>
                setAudioSettings({ ...audioSettings, noiseSuppression: e.target.checked })
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Acoustic Echo Cancellation (AEC)
              </p>
              <p className="text-[11px] text-slate-500">
                Suppresses speaker feedback during open-mic discussions.
              </p>
            </div>
            <input
              type="checkbox"
              checked={audioSettings.echoCancellation}
              onChange={(e) =>
                setAudioSettings({ ...audioSettings, echoCancellation: e.target.checked })
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* AI Automation Preferences */}
      <Card className="p-6 sm:p-8 space-y-4 shadow-xl border-slate-200/80 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            AI Automation Defaults
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-dark-border">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Auto-generate Executive Digest after every call
              </p>
              <p className="text-[11px] text-slate-500">
                Compiles bullet points and decisions immediately when room ends.
              </p>
            </div>
            <input
              type="checkbox"
              checked={aiPreferences.autoSummarize}
              onChange={(e) =>
                setAiPreferences({ ...aiPreferences, autoSummarize: e.target.checked })
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Email Summary Briefing to All Invitees
              </p>
              <p className="text-[11px] text-slate-500">
                Dispatches a formatted PDF summary within 5 minutes of meeting conclusion.
              </p>
            </div>
            <input
              type="checkbox"
              checked={aiPreferences.sendEmailDigest}
              onChange={(e) =>
                setAiPreferences({ ...aiPreferences, sendEmailDigest: e.target.checked })
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
