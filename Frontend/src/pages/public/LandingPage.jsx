import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Video,
  FileText,
  CheckCircle,
  Users,
  Mic,
  Lock,
  Play,
  Share2,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';

export const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('summary');

  const features = [
    {
      icon: Sparkles,
      title: 'Real-Time Neural Transcription',
      description: 'Zero-latency multi-speaker diarization across 40+ languages with domain-specific vocabulary adaptation.',
      color: 'indigo',
    },
    {
      icon: FileText,
      title: 'Autonomous Executive Summaries',
      description: 'Synthesizes 60-minute discussions into actionable 3-minute executive briefings with key decisions highlighted.',
      color: 'purple',
    },
    {
      icon: CheckCircle,
      title: 'AI Action Item Tracking',
      description: 'Automatically detects assigned tasks, deliverables, and due dates, synchronizing straight into your workflows.',
      color: 'emerald',
    },
    {
      icon: Bot,
      title: 'IntellBot Meeting Assistant',
      description: 'Ask natural-language questions about any discussion point or blocker during or after your meeting.',
      color: 'cyan',
    },
    {
      icon: Video,
      title: 'Ultra-Low Latency Video Mesh',
      description: 'Silky smooth 1080p 60fps conferencing powered by distributed edge media nodes with adaptive bitrate.',
      color: 'amber',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Security & Compliance',
      description: 'End-to-end AES-256 GCM encryption, SOC2 Type II certified, GDPR compliant, and strict zero-data-retention options.',
      color: 'rose',
    },
  ];

  const metrics = [
    { value: '42%', label: 'Reduction in Follow-up Meetings' },
    { value: '99.4%', label: 'Transcription Accuracy Rate' },
    { value: '3.5x', label: 'Faster Action Item Turnaround' },
    { value: '180k+', label: 'Enterprise Hours Saved' },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Next-Gen Enterprise Video AI 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">Now with Autonomous Actions</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Turn Every Enterprise Meeting Into{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Instant Actionable Intelligence
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            IntellMeet combines crystal-clear HD video conferencing with real-time AI transcription, automated executive summaries, and intelligent task extraction designed for modern enterprise teams.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="gradient" rightIcon={ArrowRight} className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/meetings/lobby/meet-102" className="w-full sm:w-auto">
              <Button size="lg" variant="glass" leftIcon={Play} className="w-full sm:w-auto">
                Experience Live Demo
              </Button>
            </Link>
          </div>

          {/* Enterprise Trust Signals */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> SOC2 Type II Certified</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-indigo-500" /> AES-256 GCM Encryption</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-purple-500" /> 10,000+ Concurrent Rooms</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Zero Credit Card Required</span>
          </div>
        </div>

        {/* Interactive Product Showcase Mockup */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-3xl border border-slate-200/80 dark:border-dark-border bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl shadow-2xl p-4 sm:p-6 overflow-hidden">
          {/* Mockup Header Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-dark-border gap-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-2">
                Sprint 24 Architecture & AI Roadmap Sync
              </span>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-dark-surface p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'summary'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                AI Summary
              </button>
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'transcript'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Live Transcript
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'actions'
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Extracted Tasks
              </button>
            </div>
          </div>

          {/* Mockup Screen View */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[360px]">
            {/* Left Column: Simulated Meeting Feeds */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-3">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center aspect-video group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                  alt="Alex Vance"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Alex Vance (Host)
                </div>
                <div className="absolute top-2.5 right-2.5 p-1 rounded-md bg-indigo-600/90 text-white text-[10px] font-bold">
                  Speaking
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"
                  alt="David Miller"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  David Miller
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80"
                  alt="Elena Rostova"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Elena Rostova
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80"
                  alt="Sarah Chen"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Sarah Chen
                </div>
              </div>
            </div>

            {/* Right Column: AI Intel Panel */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-50 dark:bg-dark-surface p-4 border border-slate-200/80 dark:border-dark-border flex flex-col justify-between">
              {activeTab === 'summary' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> IntellBot Autonomous Digest
                    </span>
                    <Badge size="sm" variant="emerald">Confidence 99%</Badge>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    The leadership team approved Sprint 24 architecture with high-speed WebRTC fallback on APAC nodes. David confirmed 99.9% uptime SLA compliance.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                      Decisions Made:
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                      <li>Rollout dark mode accessibility system on all client apps.</li>
                      <li>Deploy WebRTC Edge SFU clusters in Tokyo and Sydney.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'transcript' && (
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">00:04:12</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Alex Vance:</span>
                    <span className="text-slate-600 dark:text-slate-400">Let us verify the multi-region audio stream latency.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">00:04:28</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">David Miller:</span>
                    <span className="text-slate-600 dark:text-slate-400">Pings are under 18ms across all benchmark nodes.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">00:05:01</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Elena Rostova:</span>
                    <span className="text-slate-600 dark:text-slate-400">The design tokens are ready for Sprint 25 integration.</span>
                  </div>
                </div>
              )}

              {activeTab === 'actions' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Deploy Tokyo Edge Clusters
                      </span>
                    </div>
                    <Badge size="sm" variant="rose">Urgent</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Finalize WCAG Contrast Tokens
                      </span>
                    </div>
                    <Badge size="sm" variant="indigo">Elena R.</Badge>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200/80 dark:border-dark-border flex items-center justify-between text-[11px] text-slate-500">
                <span>Realtime Socket.IO Sync Active</span>
                <Link to="/meetings/lobby/meet-102" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1">
                  Launch Interactive Demo <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-dark-border shadow-soft dark:shadow-soft-dark text-center">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {m.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="indigo">Enterprise Features</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Engineered for High-Stakes Collaboration
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Say goodbye to frantic note-taking and missed context. IntellMeet puts AI intelligence directly into your workflow so teams can focus on decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hover className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/60 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Enterprise Security Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-14 border border-indigo-900/50 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Enterprise-Grade Trust
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Bank-Grade Security with Zero AI Hallucination Exposure
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Your meeting voice streams and data never train external LLMs. We provide dedicated VPC deployment, Single Sign-On (SAML/Okta), automated audit logs, and hardware-accelerated AES-256 GCM encryption.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/contact">
                <Button variant="primary" size="md">
                  Request Security Whitepaper
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" size="md">
                  Deploy Workspace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to Transform Your Meeting Culture?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Join thousands of forward-thinking engineering, product, and leadership teams running smarter meetings with IntellMeet.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup">
              <Button size="lg" variant="gradient" rightIcon={ArrowRight}>
                Start Free Enterprise Workspace
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Enterprise Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
