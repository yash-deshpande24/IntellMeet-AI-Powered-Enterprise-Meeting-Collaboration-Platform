import Task from '../models/Task.js';
import { createNotification, findUserByName } from '../services/notificationService.js';

// Notify the assignee of a task (does nothing if unassigned or if you assign it to yourself)
const notifyAssignee = async (req, task) => {
  const recipient = await findUserByName(task.assignee);
  if (!recipient) return;
  if (String(recipient._id) === String(req.user._id || req.user.id)) return;

  await createNotification({
    io: req.app.get('io'),
    userId: recipient._id,
    type: 'task-assigned',
    title: 'New task assigned to you',
    message: `${req.user.name} assigned you "${task.title}"`,
    link: '/workspace',
  });
};

export const getTasks = async (req, res) => {
  try {
    const { workspaceId, status, priority, assignee } = req.query;
    const query = {};

    if (workspaceId) query.workspaceId = workspaceId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = new RegExp(assignee, 'i');

    const tasks = await Task.find(query)
      .populate('creator', 'name email avatar')
      .populate('assigneeId', 'name email avatar')
      .populate('meetingId', 'title roomCode')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignee, workspaceId, meetingId, dueDate, tags } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      assignee: assignee || 'Unassigned',
      creator: req.user._id || req.user.id,
      workspaceId: workspaceId || null,
      meetingId: meetingId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: tags || []
    });

    await notifyAssignee(req, task);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const before = await Task.findById(id).select('assignee');
    const task = await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (before && updateData.assignee && updateData.assignee !== before.assignee) {
      await notifyAssignee(req, task);
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, order } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (status) task.status = status;
    if (order !== undefined) task.order = order;
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task moved to ${status}`,
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
