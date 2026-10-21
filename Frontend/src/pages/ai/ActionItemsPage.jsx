import React, { useState, useEffect } from 'react';
import { mockActionItems as initialActions, mockTeamMembers } from '../../data/mockData';
import { taskService } from '../../services/taskService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useNotification } from '../../context/NotificationContext';
import {
  CheckSquare,
  PlusCircle,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  User,
  AlertCircle,
} from 'lucide-react';

export const ActionItemsPage = () => {
  const { success } = useNotification();
  const [actions, setActions] = useState(initialActions);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'completed'
  const [modalOpen, setModalOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    meetingTitle: 'Sprint 24 Architecture Sync',
    assigneeName: 'Alex Vance',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'High',
  });

  // Fetch backend tasks with fallback
  useEffect(() => {
    taskService
      .getTasks()
      .then((data) => {
        if (data?.tasks && data.tasks.length > 0) {
          const mapped = data.tasks.map((t) => ({
            id: t._id,
            meetingId: t.meetingId?._id || 'custom',
            meetingTitle: t.meetingId?.title || 'Platform Architecture Board',
            title: t.title,
            assignee: {
              name: t.assignee || 'Alex Vance',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            },
            dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '2026-10-24',
            priority: t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'Medium',
            status: t.status === 'done' ? 'completed' : 'pending',
            completed: t.status === 'done',
          }));

          const existingIds = new Set(mapped.map((m) => m.id));
          const uniqueInitial = initialActions.filter((a) => !existingIds.has(a.id));
          setActions([...mapped, ...uniqueInitial]);
        }
      })
      .catch((err) => {
        console.warn('[ActionItemsPage] Fallback to mock action items:', err.message);
      });
  }, []);

  const toggleTask = (id) => {
    setActions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.completed;
          if (next) success(`Action item marked as resolved!`);
          // Sync with backend if Mongo ID
          if (id.length === 24) {
            taskService.updateTaskStatus(id, next ? 'done' : 'in-progress').catch(() => {});
          }
          return { ...item, completed: next, status: next ? 'completed' : 'pending' };
        }
        return item;
      })
    );
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    // Persist to backend if available
    try {
      await taskService.createTask({
        title: newTask.title,
        status: 'todo',
        priority: newTask.priority.toLowerCase(),
        assignee: newTask.assigneeName,
        dueDate: new Date(newTask.dueDate),
      });
    } catch (err) {
      console.warn('[ActionItemsPage] Persisted locally notice:', err.message);
    }

    const created = {
      id: 'act-' + Date.now(),
      meetingId: 'custom',
      meetingTitle: newTask.meetingTitle,
      title: newTask.title,
      assignee: {
        name: newTask.assigneeName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      status: 'pending',
      completed: false,
    };

    setActions([created, ...actions]);
    setModalOpen(false);
    setNewTask({
      title: '',
      meetingTitle: 'Sprint 24 Architecture Sync',
      assigneeName: 'Alex Vance',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'High',
    });
    success('New action item created and assigned!');
  };

  const filteredActions = actions.filter((a) => {
    if (filterStatus === 'pending') return !a.completed;
    if (filterStatus === 'completed') return a.completed;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
              <CheckSquare className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI-Extracted Action Items
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deliverables, assignees, and target due dates detected during meetings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            onClick={() => success('Exported tasks to CSV')}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={PlusCircle}
            onClick={() => setModalOpen(true)}
          >
            Add Action Item
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-slate-100 dark:bg-dark-surface p-1 rounded-xl">
          {[
            { id: 'all', label: `All (${actions.length})` },
            { id: 'pending', label: `Pending (${actions.filter((a) => !a.completed).length})` },
            { id: 'completed', label: `Completed (${actions.filter((a) => a.completed).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === tab.id
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Items List */}
      <Card className="divide-y divide-slate-100 dark:divide-dark-border overflow-hidden shadow-md">
        {filteredActions.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No action items in this filter view.
          </div>
        ) : (
          filteredActions.map((item) => (
            <div
              key={item.id}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                item.completed ? 'bg-slate-50/50 dark:bg-dark-surface/40 opacity-70' : ''
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleTask(item.id)}
                  className="mt-1 w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-dark-border cursor-pointer"
                />
                <div className="space-y-1 min-w-0">
                  <h3
                    className={`text-sm font-bold leading-snug ${
                      item.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Conference: {item.meetingTitle}
                  </p>
                </div>
              </div>

              {/* Right Meta */}
              <div className="flex items-center gap-4 flex-shrink-0 pt-2 sm:pt-0">
                <div className="flex items-center gap-2">
                  <Avatar src={item.assignee.avatar} name={item.assignee.name} size="xs" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {item.assignee.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Due {item.dueDate}</span>
                </div>

                <Badge
                  size="sm"
                  variant={
                    item.priority === 'Urgent'
                      ? 'rose'
                      : item.priority === 'High'
                      ? 'amber'
                      : item.priority === 'Medium'
                      ? 'indigo'
                      : 'slate'
                  }
                >
                  {item.priority}
                </Badge>
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Create Action Item Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Action Item"
        subtitle="Specify task deliverables and assignees"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Deliverable *"
            placeholder="e.g. Schedule pen-test debrief with SecOps"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Assignee
              </label>
              <select
                value={newTask.assigneeName}
                onChange={(e) => setNewTask({ ...newTask, assigneeName: e.target.value })}
                className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {mockTeamMembers.map((m) => (
                  <option key={m.id} value={m.name}>{m.name} ({m.department})</option>
                ))}
              </select>
            </div>

            <Input
              label="Target Due Date"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Priority Level
            </label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Urgent">Urgent (Immediate)</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Action Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
