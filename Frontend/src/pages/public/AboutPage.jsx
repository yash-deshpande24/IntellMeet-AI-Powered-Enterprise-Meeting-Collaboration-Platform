import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Award, ShieldCheck, ArrowRight, Globe, Zap, Cpu } from 'lucide-react';

export const AboutPage = () => {
  const leadership = [
    {
      name: 'Alex Vance',
      role: 'Chief Executive Officer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'Former VP of Collaboration Products, passionate about eliminating meeting fatigue with autonomous neural assistants.',
    },
    {
      name: 'David Miller',
      role: 'Chief Technology Officer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      bio: 'Distributed systems architect specialized in real-time WebRTC media pipelines and multi-region SFU edge clusters.',
    },
    {
      name: 'Elena Rostova',
      role: 'Head of Product Design',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      bio: 'Pioneer in human-centered AI interfaces, focusing on accessibility, glassmorphic clarity, and seamless ergonomics.',
    },
    {
      name: 'Marcus Brody',
      role: 'Chief Information Security Officer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      bio: 'Enterprise security veteran leading our SOC2 Type II, HIPAA, and zero-knowledge end-to-end cryptographic architecture.',
    },
  ];

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="indigo">Our Mission</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Reinventing How Global Enterprises Communicate and Execute
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Meetings shouldn't be a black hole where context disappears. IntellMeet was founded to give teams superpowers: capturing every insight, decision, and next step with autonomous AI.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Neural First</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We build proprietary neural acoustic models that filter noise, identify speakers with pinpoint precision, and understand complex engineering dialects.
          </p>
        </Card>

        <Card className="p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacy by Architecture</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Enterprise data privacy isn't an afterthought. Your meeting transcripts and recordings remain strictly confidential and are never used to train public models.
          </p>
        </Card>

        <Card className="p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Zero Friction Speed</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            One-click join, ultra-fast WebRTC latency, instantaneous summarization, and seamless integrations into Jira, Slack, and GitHub.
          </p>
        </Card>
      </div>

      {/* Leadership Team */}
      <div className="space-y-10">
        <div className="text-center space-y-3">
          <Badge variant="purple">Leadership</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Built by Industry Pioneers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Experienced builders who previously scaled communications infrastructure for millions of active users.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((leader, i) => (
            <Card key={i} className="overflow-hidden">
              <img
                src={leader.avatar}
                alt={leader.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-5 space-y-2">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {leader.name}
                </h4>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {leader.role}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {leader.bio}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-indigo-600 text-white p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Join the Meeting Revolution?</h2>
        <p className="max-w-xl mx-auto text-indigo-100 text-sm sm:text-base">
          Experience what automated meeting intelligence feels like. Start your 14-day enterprise trial today.
        </p>
        <Link to="/signup" className="inline-block">
          <Button variant="secondary" size="lg" rightIcon={ArrowRight}>
            Create Free Account
          </Button>
        </Link>
      </div>
    </div>
  );
};
