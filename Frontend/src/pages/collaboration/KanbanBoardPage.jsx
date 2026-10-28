import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { taskService } from '../../services/taskService';
import { workspaceService } from '../../services/workspaceService';
import { Kanban, Plus, X, ArrowLeft } from 'lucide-react';

// Status keys must match the enum in Backend/src/models/Task.js
const COLUMNS = [
  { key: 'backlog', label: 'Backlog', dot: 'bg-slate-400' },
  { key: 'todo', label: 'To Do', dot: 'bg-indigo-500' },
  { key: 'in-progress', label: 'In Progress', dot: 'bg-amber-500' },
  { key: 'review', label: 'Review', dot: 'bg-purple-500' },
  { key: 'done', label: 'Done', dot: 'bg-emerald-500' },
];

const PRIORITY_VARIANT = { high: 'purple', medium: 'indigo', low: 'slate' };
const EMPTY_FORM = { title: '', description: '', priority: 'medium' };

// Backend may return an array, { tasks }, { workspaces } or { data }
const toList = (res, key) =>
  Array.isArray(res) ? res : res?.[key] ?? res?.data ?? [];
const toItem = (res, key) => res?.[key] ?? res?.data ?? res;

export const KanbanBoardPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceId, setWorkspaceId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const list = toList(await workspaceService.getWorkspaces(), 'workspaces');
        setWorkspaces(list);
        if (list.length) setWorkspaceId(list[0]._id);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load workspaces');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadTasks = useCallback(async () => {
    if (!workspaceId) return;
    try {
      setError('');
      const res = await taskService.getTasks({ workspace: workspaceId });
      setTasks(toList(res, 'tasks'));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load tasks');
    }
  }, [workspaceId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await taskService.createTask({
        ...form,
        workspace: workspaceId,
        status: 'backlog',
      });
      setTasks((prev) => [...prev, toItem(res, 'task')]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  // Optimistic move; rolled back if PATCH /tasks/:id/status fails
  const handleDrop = async (e, status) => {
    e.preventDefault();
    setDragOver('');
    const id = e.dataTransfer.getData('text/plain');
    const task = tasks.find((t) => t._id === id);
    if (!task || task.status === status) return;

    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));
    try {
      await taskService.updateTaskStatus(id, status);
    } catch (err) {
      setTasks(previous);
      setError(err.response?.data?.message || 'Failed to move task');
    }
  };

  const handleDelete = async (id) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await taskService.deleteTask(id);
    } catch (err) {
      setTasks(previous);
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading board…</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/workspace"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Workspace Hub
          </Link>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Kanban className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Project Board
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Select workspace"
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm text-slate-900 dark:text-white px-3 py-2"
          >
            {workspaces.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>
          <Button
            variant="primary"
            size="sm"
            leftIcon={showForm ? X : Plus}
            onClick={() => setShowForm((s) => !s)}
            disabled={!workspaceId}
          >
            {showForm ? 'Cancel' : 'New Task'}
          </Button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs px-4 py-3"
        >
          {error}
        </p>
      )}

      {/* Create task form */}
      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-4">
            <input
              required
              aria-label="Task title"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm px-3 py-2"
            />
            <input
              aria-label="Task description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm px-3 py-2"
            />
            <select
              aria-label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm px-3 py-2"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {saving ? 'Creating…' : 'Create Task'}
            </Button>
          </form>
        </Card>
      )}

      {/* Board */}
      {!workspaces.length ? (
        <Card className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No workspaces yet. Create one to start using the board.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
          {COLUMNS.map((col) => {
            const items = tasks.filter((t) => t.status === col.key);
            return (
              <section
                key={col.key}
                aria-label={col.label}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(col.key);
                }}
                onDragLeave={() => setDragOver('')}
                onDrop={(e) => handleDrop(e, col.key)}
                className={`min-h-[320px] min-w-[200px] rounded-2xl border p-3 bg-slate-50 dark:bg-dark-card/50 transition-colors ${
                  dragOver === col.key
                    ? 'border-indigo-400 ring-2 ring-indigo-300/50'
                    : 'border-slate-200 dark:border-dark-border'
                }`}
              >
                <h2 className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    {col.label}
                  </span>
                  <span className="text-slate-400">{items.length}</span>
                </h2>

                <div className="space-y-2">
                  {items.map((task) => (
                    <Card
                      key={task._id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', task._id)}
                      className="p-3 cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {task.title}
                        </p>
                        <button
                          type="button"
                          aria-label={`Delete ${task.title}`}
                          onClick={() => handleDelete(task._id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {task.description && (
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          {task.description}
                        </p>
                      )}
                      {task.priority && (
                        <div className="mt-2">
                          <Badge size="sm" variant={PRIORITY_VARIANT[task.priority] || 'slate'}>
                            {task.priority}
                          </Badge>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KanbanBoardPage;
