import mongoose from 'mongoose';
import Meeting from '../models/Meeting.js';
import Task from '../models/Task.js';
import { AiService } from '../services/aiService.js';
import { createNotification, findUserByName } from '../services/notificationService.js';
import { sendMeetingInvitations, generatePlainTextInvite } from '../services/emailService.js';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

const isDbConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback meeting store for when MongoDB is in fallback/offline mode
const inMemoryMeetings = [
  {
    _id: '65f000000000000000000010',
    title: 'Q3 Enterprise Architecture & AI Copilot Review',
    description: 'Quarterly review of WebRTC mesh stability, AI summarization pipeline, and Kanban integration.',
    roomCode: 'int-arc-772-990',
    passcode: '492019',
    requirePasscode: true,
    scheduledAt: new Date(),
    duration: 45,
    status: 'scheduled',
    hostName: 'Sarah Connor',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    participants: [
      { name: 'Sarah Connor', email: 'admin@intellmeet.io' },
      { name: 'Alex Rivera', email: 'member@intellmeet.io' }
    ],
    transcript: [],
    summary: {
      tags: ['Architecture', 'WebRTC', 'AI']
    }
  }
];

// A meeting id from the URL must look like a MongoDB id, otherwise the database throws a 500
const badId = (res, id) => {
  if (mongoose.Types.ObjectId.isValid(id)) return false;
  res.status(404).json({ success: false, message: 'Meeting not found' });
  return true;
};

const generateRoomCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `int-${part1}-${part2}-${part3}`;
};


export const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createMeeting = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      scheduledAt, 
      duration, 
      workspaceId, 
      tags,
      requirePasscode,
      passcode: userPasscode,
      participants: inputParticipants,
      invitedEmails: inputEmails
    } = req.body;

    const roomCode = req.body.roomCode || generateRoomCode();
    const isPasscodeRequired = requirePasscode !== false;
    const passcode = isPasscodeRequired ? (userPasscode?.trim() || generatePasscode()) : '';

    // Process and sanitize invited emails
    let invitedEmails = [];
    if (Array.isArray(inputEmails)) {
      invitedEmails = inputEmails;
    } else if (typeof inputEmails === 'string') {
      invitedEmails = inputEmails.split(/[,;\s]+/).filter(Boolean);
    } else if (typeof inputParticipants === 'string') {
      invitedEmails = inputParticipants.split(/[,;\s]+/).filter(Boolean);
    } else if (Array.isArray(inputParticipants)) {
      invitedEmails = inputParticipants
        .map(p => (typeof p === 'string' ? p : p.email))
        .filter(Boolean);
    }

    invitedEmails = [...new Set(invitedEmails.map(e => e.trim().toLowerCase()))]
      .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    const meetingData = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: title || 'Strategic Project Sync',
      description: description || '',
      host: req.user?._id || req.user?.id || '65f000000000000000000001',
      hostName: req.user?.name || 'Host',
      hostAvatar: req.user?.avatar || '',
      roomCode,
      passcode,
      requirePasscode: isPasscodeRequired,
      invitedEmails,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      duration: duration || 45,
      status: req.body.isInstant ? 'active' : 'scheduled',
      workspaceId: workspaceId || null,
      participants: [{
        user: req.user?._id || req.user?.id || '65f000000000000000000001',
        name: req.user?.name || 'Host',
        email: req.user?.email || 'host@intellmeet.io',
        avatar: req.user?.avatar || '',
        joinedAt: new Date()
      }],
      transcript: [],
      summary: {
        tags: tags || ['Sprint Sync', 'Enterprise', 'Strategy']
      }
    };

    let meeting = meetingData;
    if (isDbConnected()) {
      try {
        meeting = await Meeting.create(meetingData);
      } catch (dbErr) {
        console.warn('[Meeting Controller] MongoDB save notice, using in-memory store:', dbErr.message);
        inMemoryMeetings.unshift(meetingData);
      }
    } else {
      inMemoryMeetings.unshift(meetingData);
    }

    // Generate Zoom-style real-time meeting join link
    const lanIp = getLocalIp();
    const port = 5173;
    const networkBaseUrl = (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('localhost'))
      ? process.env.CLIENT_URL
      : `http://${lanIp}:${port}`;
    const localBaseUrl = `http://localhost:${port}`;
    const networkMeetingLink = `${networkBaseUrl}/meetings/lobby/${roomCode}${passcode ? `?pwd=${passcode}` : ''}`;
    const localMeetingLink = `${localBaseUrl}/meetings/lobby/${roomCode}${passcode ? `?pwd=${passcode}` : ''}`;
    const meetingLink = networkMeetingLink;
    const plainTextInvite = generatePlainTextInvite({
      hostName: req.user?.name || 'Host',
      title: meeting.title,
      scheduledAt: meeting.scheduledAt,
      duration: meeting.duration,
      meetingLink,
      networkMeetingLink,
      localMeetingLink,
      lanIp,
      roomCode,
      passcode
    });

    // Send email invitations (Zoom style)
    let emailStatus = { count: invitedEmails.length, delivered: false, simulated: true };
    if (invitedEmails.length > 0) {
      try {
        emailStatus = await sendMeetingInvitations({
          hostName: req.user?.name || 'Host',
          title: meeting.title,
          description: meeting.description,
          scheduledAt: meeting.scheduledAt,
          duration: meeting.duration,
          meetingLink,
          roomCode,
          passcode,
          recipients: invitedEmails
        });
      } catch (emailErr) {
        console.warn('[Meeting Controller] Email invitation notice:', emailErr.message);
        emailStatus = { error: emailErr.message, simulated: true };
      }
    }

    res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      meeting,
      meetingLink,
      roomCode,
      passcode,
      requirePasscode: isPasscodeRequired,
      invitedEmails,
      emailStatus,
      invitationText: plainTextInvite
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;

    if (!isDbConnected()) {
      let filtered = [...inMemoryMeetings];
      if (status) filtered = filtered.filter(m => m.status === status);
      return res.status(200).json({
        success: true,
        count: filtered.length,
        meetings: filtered.slice(0, Number(limit))
      });
    }

    const query = {};
    if (status) query.status = status;

    const meetings = await Meeting.find(query)
      .populate('host', 'name email avatar department')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings
    });
  } catch (error) {
    // Graceful in-memory fallback
    res.status(200).json({
      success: true,
      count: inMemoryMeetings.length,
      meetings: inMemoryMeetings
    });
  }
};

export const getMeetingByCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!isDbConnected()) {
      let meeting = inMemoryMeetings.find(m => m.roomCode === code);
      if (!meeting) {
        meeting = {
          _id: new mongoose.Types.ObjectId().toString(),
          title: `Enterprise Collab - ${code}`,
          host: req.user?._id || '65f000000000000000000001',
          hostName: req.user?.name || 'Host',
          hostAvatar: req.user?.avatar || '',
          roomCode: code,
          passcode: '',
          requirePasscode: false,
          status: 'active',
          participants: [{
            user: req.user?._id || '65f000000000000000000001',
            name: req.user?.name || 'Host',
            email: req.user?.email || 'host@intellmeet.io',
            avatar: req.user?.avatar || '',
            joinedAt: new Date()
          }],
          transcript: [],
          summary: { tags: ['Ad-hoc'] }
        };
        inMemoryMeetings.push(meeting);
      }
      return res.status(200).json({ success: true, meeting });
    }

    let meeting = await Meeting.findOne({ roomCode: code })
      .populate('host', 'name email avatar department')
      .populate('workspaceId', 'name color');

    if (!meeting) {
      // Auto-create room if joining ad-hoc
      const hostId = req.user?._id || req.user?.id || new mongoose.Types.ObjectId();
      const hostName = req.user?.name || 'Host';
      const hostAvatar = req.user?.avatar || '';
      meeting = await Meeting.create({
        title: `Enterprise Collab - ${code}`,
        host: hostId,
        hostName,
        hostAvatar,
        roomCode: code,
        status: 'active',
        participants: [{
          user: hostId,
          name: hostName,
          email: req.user?.email || 'host@intellmeet.io',
          avatar: hostAvatar,
          joinedAt: new Date()
        }]
      });
    }

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    // Check in-memory on error
    const memMeeting = inMemoryMeetings.find(m => m.roomCode === req.params.code);
    if (memMeeting) {
      return res.status(200).json({ success: true, meeting: memMeeting });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyMeetingPasscode = async (req, res) => {
  try {
    const { code } = req.params;
    const { passcode } = req.body;

    let meeting = null;
    if (isDbConnected()) {
      meeting = await Meeting.findOne({ roomCode: code });
    }
    if (!meeting) {
      meeting = inMemoryMeetings.find(m => m.roomCode === code);
    }

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting room not found' });
    }

    if (!meeting.requirePasscode || !meeting.passcode) {
      return res.status(200).json({ success: true, valid: true, message: 'No passcode required for this meeting' });
    }

    const isMatch = (passcode || '').trim() === meeting.passcode.trim();
    if (!isMatch) {
      return res.status(401).json({ success: false, valid: false, message: 'Invalid meeting passcode. Please check and try again.' });
    }

    res.status(200).json({ success: true, valid: true, message: 'Passcode verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (badId(res, id)) return;

    if (!isDbConnected()) {
      const meeting = inMemoryMeetings.find(m => m._id === id || m.roomCode === id);
      if (meeting) return res.status(200).json({ success: true, meeting });
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const meeting = await Meeting.findById(id)
      .populate('host', 'name email avatar department')
      .populate('workspaceId', 'name color');

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
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

    if (badId(res, id)) return;
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    meeting.status = status;
    if (status === 'completed') {
      meeting.endedAt = new Date();
      // Auto-generate AI summary if empty
      if (!meeting.summary?.executiveSummary) {
        const summary = await AiService.generateMeetingSummary({
          title: meeting.title,
          transcript: meeting.transcript,
          participants: meeting.participants
        });
        meeting.summary = summary;
      }
    }

    await meeting.save();

    res.status(200).json({
      success: true,
      message: `Meeting updated to ${status}`,
      meeting
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const triggerAiSummary = async (req, res) => {
  try {
    const { id } = req.params;
    if (badId(res, id)) return;
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

    // Day 20: tell the host and participants that the summary is ready
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

export const generateMeetingSummary = triggerAiSummary;

export const saveTranscriptItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { speaker, text, sentiment, confidence, avatar } = req.body;

    if (badId(res, id)) return;
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

    // Broadcast live transcript event to socket room
    const io = req.app.get('io');
    if (io) {
      io.to(meeting.roomCode).emit('transcript-item', item);
    }

    res.status(201).json({
      success: true,
      transcriptItem: item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const convertActionItemToTask = async (req, res) => {
  try {
    const { meetingId, actionItemId } = req.params;
    const { workspaceId, priority, assignee, dueDate } = req.body;

    if (badId(res, meetingId)) return;
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    const actionItem = meeting.summary.actionItems.find((item) => item.id === actionItemId || item._id?.toString() === actionItemId);
    if (!actionItem) {
      return res.status(404).json({ success: false, message: 'Action item not found in meeting summary' });
    }

    const task = await Task.create({
      title: actionItem.task,
      description: `Generated from meeting "${meeting.title}" action items.`,
      status: 'todo',
      priority: priority || actionItem.priority || 'medium',
      assignee: assignee || actionItem.assignee || 'Unassigned',
      creator: req.user._id || req.user.id,
      workspaceId: workspaceId || meeting.workspaceId,
      meetingId: meeting._id,
      meetingTitle: meeting.title,
      dueDate: dueDate || actionItem.dueDate || new Date(Date.now() + 3 * 86400000),
      tags: ['AI Action Item', 'Meeting Extract']
    });

    actionItem.status = 'converted';
    actionItem.convertedTaskId = task._id;
    await meeting.save();

    // Day 20: notify the person the action item was assigned to
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
