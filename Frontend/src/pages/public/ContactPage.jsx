import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNotification } from '../../context/NotificationContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Building, ShieldCheck } from 'lucide-react';

export const ContactPage = () => {
  const { success } = useNotification();
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    company: '',
    teamSize: '50-250',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.workEmail.trim() || !/\S+@\S+\.\S+/.test(formData.workEmail)) {
      errs.workEmail = 'Valid business email is required';
    }
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.message.trim()) errs.message = 'Please provide details about your requirements';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 800));
    setSubmitting(false);
    setSubmitted(true);
    success('Thank you! Our enterprise solutions team will reach out within 2 hours.');
  };

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="indigo">Enterprise Solutions</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Let’s Discuss Your Team’s Intelligence Needs
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          From custom VPC deployments to custom LLM compliance policies, our enterprise specialists are here to design your setup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Information Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Connect Directly With Our Solutions Architects
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We provide personalized proof-of-concept demos, bespoke pricing for volume seats, and assisted migration from legacy conferencing suites.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
              <Mail className="w-5 h-5 text-indigo-600 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Direct Enterprise Sales</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">enterprise@intellmeet.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
              <Phone className="w-5 h-5 text-indigo-600 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Worldwide Support Desk</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">+1 (800) 492-9102 (24/7 SLA Priority)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
              <Building className="w-5 h-5 text-indigo-600 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Global Headquarters</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">540 Market Street, Suite 900, San Francisco, CA</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4" /> Confidentiality Guaranteed
            </div>
            <p className="leading-relaxed">
              All communications are strictly covered under standard enterprise NDA. Your infrastructure details are never disclosed.
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <Card className="p-8 sm:p-10">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Message Dispatched Successfully
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  A senior enterprise specialist has received your inquiry and will contact you via email at <strong className="text-slate-900 dark:text-white">{formData.workEmail}</strong> shortly.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ fullName: '', workEmail: '', company: '', teamSize: '50-250', message: '' });
                  }}
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    placeholder="e.g. Alex Vance"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    error={errors.fullName}
                  />
                  <Input
                    label="Work Email *"
                    type="email"
                    placeholder="alex@company.com"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    error={errors.workEmail}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company Name *"
                    placeholder="e.g. Acme Corp"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    error={errors.company}
                  />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Company Size
                    </label>
                    <select
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      className="block w-full rounded-xl text-sm py-2.5 px-3.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="1-49">1 - 49 employees</option>
                      <option value="50-250">50 - 250 employees</option>
                      <option value="251-1000">251 - 1,000 employees</option>
                      <option value="1000+">1,000+ Enterprise seats</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    How can IntellMeet assist your organization? *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your meeting volume, existing toolchains (Zoom, Teams, Jira), and key AI requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="block w-full rounded-xl text-sm p-3.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-500 font-medium">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  isLoading={submitting}
                  rightIcon={Send}
                >
                  Submit Enterprise Request
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
