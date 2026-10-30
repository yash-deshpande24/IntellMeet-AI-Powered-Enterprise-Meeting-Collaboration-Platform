import Meeting from '../models/Meeting.js';
import Task from '../models/Task.js';
import { AiService } from '../services/aiService.js';
import { createNotification, findUserByName } from '../services/notificationService.js';
import { v4 as uuidv4 } from 'uuid';

const generateRoomCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `int-${part1}-${part2}-${part3}`;
};

export const createMeeting = async (req, res) => {
  try {
    const { title, description, scheduledAt, duration, workspaceId, tags } = req.body;
    const roomCode = req.body.roomCode || generateRoomCode();

    const meeting = await Meeting.create({
      title: title || 'Strategic Project Sync',
      description: description || '',
      host: req.user._id || req.user.id,
      hostName: req.user.name || 'Host',
      hostAvatar: req.user.avatar || '',
      roomCode,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      duration: duration || 30,
      status: req.body.isInstant ? 'active' : 'scheduled',
      workspaceId: workspaceId || null,
      participants: [{
        user: req.user._id || req.user.id,
        name: req.user.name || 'Host',
        email: req.user.email,
        avatar: req.user.avatar || '',
        joinedAt: new Date()
      }],
      summary: {
        tags: tags || ['Sprint Sync', 'Enterprise', 'Strategy']
      }
    });

    res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      meeting
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const query = {};
    if (status) query.status = status;

    const meetings = await Meeting.find(query)
      .sort({ scheduledAt: -1 })
      .limit(Number(limit))
      .populate('workspaceId', 'name color');

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    let meeting = null;

    if (id.startsWith('int-')) {
      meeting = await Meeting.findOne({ roomCode: id }).populate('workspaceId', 'name color');
    } else {
      meeting = await Meeting.findById(id).populate('workspaceId', 'name color');
    }

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting room not found' });
    }

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMeetingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const meeting = await Meeting.findByIdAndUpdate(
      id,
      { status, endedAt: status === 'completed' ? new Date() : undefined },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    res.status(200).json({
      success: true,
      message: `Meeting status updated to ${status}`,
      meeting
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateMeetingSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const summary = await AiService.generateMeetingSummary({
      title: meeting.title,
      transcript: meeting.transcript,
      participants: meeting.participants
    });

    meeting.summary = summary;
    await meeting.save();

    // Notify the host and participants that the summary is ready
    const userIds = new Set(
      [meeting.host, ...meeting.participants.map((p) => p.user)]
        .filter(Boolean)
        .map((u) => String(u))
    );
    for (const userId of userIds) {
      await createNotification({
        io: req.app.get('io'),
        userId,
        type: 'summary-ready',
        title: 'AI summary is ready',
        message: meeting.title,
        link: `/ai/summaries/${meeting._id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'AI Summary synthesized successfully',
      summary
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveTranscriptItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { speaker, text, sentiment, confidence, avatar } = req.body;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const item = {
      speaker: speaker || req.user.name,
      speakerAvatar: avatar || req.user.avatar,
      text,
      timestamp: new Date(),
      sentiment: sentiment || 'neutral',
      confidence: confidence || 0.95
    };

    meeting.transcript.push(item);
    await meeting.save();

    res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const convertActionItemToTask = async (req, res) => {
  try {
    const { meetingId, actionItemId } = req.params;
    const { workspaceId, priority, assignee, dueDate } = req.body;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const actionItem = meeting.summary.actionItems.find(a => a.id === actionItemId || a._id?.toString() === actionItemId);
    if (!actionItem) {
      return res.status(404).json({ success: false, message: 'Action item not found in meeting' });
    }

    const task = await Task.create({
      title: actionItem.task,
      description: `Auto-extracted from meeting "${meeting.title}".\nOriginal Assignee: ${actionItem.assignee}`,
      status: 'todo',
      priority: priority || actionItem.priority || 'medium',
      assignee: assignee || actionItem.assignee || 'Unassigned',
      creator: req.user._id || req.user.id,
      meetingId: meeting._id,
      meetingTitle: meeting.title,
      actionItemId: actionItem.id,
      dueDate: dueDate || actionItem.dueDate || new Date(Date.now() + 3 * 86400000),
      tags: ['AI Action Item', 'Meeting Sync']
    });

    // Mark action item converted
    actionItem.status = 'converted';
    actionItem.convertedTaskId = task._id;
    await meeting.save();

    // Notify the person the action item was assigned to
    const recipient = await findUserByName(task.assignee);
    if (recipient && String(recipient._id) !== String(req.user._id || req.user.id)) {
      await createNotification({
        io: req.app.get('io'),
        userId: recipient._id,
        type: 'action-item',
        title: 'Action item assigned to you',
        message: `From "${meeting.title}": ${task.title}`,
        link: '/ai/action-items',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Action item converted to Kanban task successfully!',
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
