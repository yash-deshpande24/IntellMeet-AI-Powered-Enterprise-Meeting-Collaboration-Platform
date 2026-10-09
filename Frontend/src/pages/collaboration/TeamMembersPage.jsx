import React, { useState } from 'react';
import { mockTeamMembers as initialMembers } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useNotification } from '../../context/NotificationContext';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Shield,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Filter,
} from 'lucide-react';

export const TeamMembersPage = () => {
  const { success, info } = useNotification();
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Member',
    department: 'Engineering',
  });

  const filteredMembers = members.filter((m) => {
    const matchesRole = roleFilter === 'All' || m.role === roleFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteForm.email.trim()) return;

    const newMember = {
      id: 'm-' + Date.now(),
      name: inviteForm.name || inviteForm.email.split('@')[0],
      email: inviteForm.email,
      role: inviteForm.role,
      department: inviteForm.department,
      status: 'Pending Invite',
      avatar: null,
      lastActive: 'Just invited',
    };

    setMembers([...members, newMember]);
    setInviteModalOpen(false);
    setInviteForm({ name: '', email: '', role: 'Member', department: 'Engineering' });
    success(`Invitation sent to ${newMember.email}!`);
  };

  const handleRemoveMember = (id, name) => {
    setMembers(members.filter((m) => m.id !== id));
    info(`Removed ${name} from enterprise workspace`);
  };

  const handleRoleChange = (id, newRole) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
    success(`Role updated to ${newRole}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Team Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage member permissions, seat allocation, and workspace invitations
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={UserPlus}
          onClick={() => setInviteModalOpen(true)}
        >
          Invite Colleague
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Role:
          </span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-semibold rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Roles ({members.length})</option>
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
            <option value="Guest">Guest</option>
          </select>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search member name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Members Table Card */}
      <Card className="overflow-hidden shadow-xl border-slate-200/80 dark:border-dark-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-dark-surface/60 border-b border-slate-200 dark:border-dark-border text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-6">Member</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Activity Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-dark-surface/40 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={member.avatar}
                        name={member.name}
                        size="md"
                        status={
                          member.status === 'Active'
                            ? 'online'
                            : member.status === 'In Meeting'
                            ? 'busy'
                            : 'offline'
                        }
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-slate-500 text-[11px]">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">
                    {member.department}
                  </td>

                  <td className="py-4 px-6">
                    <Badge
                      variant={
                        member.role === 'Owner'
                          ? 'purple'
                          : member.role === 'Admin'
                          ? 'indigo'
                          : member.role === 'Member'
                          ? 'emerald'
                          : 'slate'
                      }
                      size="sm"
                    >
                      {member.role}
                    </Badge>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          member.status === 'Active'
                            ? 'bg-emerald-500'
                            : member.status === 'In Meeting'
                            ? 'bg-rose-500 animate-pulse'
                            : member.status === 'Pending Invite'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {member.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {member.lastActive}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    {member.role !== 'Owner' && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Member Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite New Enterprise Member"
        subtitle="Send an automated onboarding invite link to join your workspace"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Liam Sterling"
            value={inviteForm.name}
            onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
          />

          <Input
            label="Corporate Work Email *"
            type="email"
            placeholder="colleague@innovatecorp.com"
            value={inviteForm.email}
            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
            autoFocus
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Workspace Role
              </label>
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Admin">Admin (Can manage rooms & members)</option>
                <option value="Member">Member (Standard access)</option>
                <option value="Guest">Guest (Restricted view)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Department
              </label>
              <select
                value={inviteForm.department}
                onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Security">Security & DevOps</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
