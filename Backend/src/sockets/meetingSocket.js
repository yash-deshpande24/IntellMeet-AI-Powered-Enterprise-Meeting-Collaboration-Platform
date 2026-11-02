import { AiService } from '../services/aiService.js';
import Meeting from '../models/Meeting.js';
import jwt from 'jsonwebtoken';
import { createNotification, findMentionedUsers } from '../services/notificationService.js';

// Who is in which room (kept in memory, so the backend runs as a single instance)
const activeRooms = new Map();

// Removes a socket from its current room and tells the others
const leaveRoom = (socket) => {
  const roomCode = socket.roomCode;
  if (!roomCode) return;

  const participants = activeRooms.get(roomCode);
  if (participants) {
    participants.delete(socket.id);
    if (participants.size === 0) activeRooms.delete(roomCode);
  }

  socket.to(roomCode).emit('user-left', {
    socketId: socket.id,
    userName: socket.user?.name || 'Participant'
  });
  socket.leave(roomCode);
  socket.roomCode = null;
};

export const setupMeetingSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Private room so notifications can be pushed live to one user
    socket.on('register-user', ({ token } = {}) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.id) socket.join(`user:${decoded.id}`);
      } catch {
        /* invalid token: ignore */
      }
    });

    // Join a meeting room. The identity comes from the verified token, not from the browser.
    socket.on('join-room', ({ roomCode, token } = {}) => {
      if (typeof roomCode !== 'string' || !roomCode || roomCode.length > 100) return;

      let user;
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = { id: decoded.id, name: decoded.name, avatar: decoded.avatar, role: decoded.role };
      } catch {
        socket.emit('room-error', { message: 'Please log in again to join this meeting.' });
        return;
      }

      if (socket.roomCode && socket.roomCode !== roomCode) leaveRoom(socket);

      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.user = user;

      if (!activeRooms.has(roomCode)) activeRooms.set(roomCode, new Map());
      const roomParticipants = activeRooms.get(roomCode);

      const participantInfo = {
        socketId: socket.id,
        userId: user.id || socket.id,
        name: user.name || 'Guest User',
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${socket.id}`,
        role: user.role || 'Member',
        audioMuted: false,
        videoMuted: false,
        screenSharing: false,
        handRaised: false,
        joinedAt: new Date()
      };
      roomParticipants.set(socket.id, participantInfo);

      // Tell the newcomer who is already here (the newcomer then sends the WebRTC offers)
      const existingPeers = Array.from(roomParticipants.values()).filter((p) => p.socketId !== socket.id);
      socket.emit('room-peers', { participants: existingPeers, self: participantInfo });

      socket.to(roomCode).emit('user-joined', { participant: participantInfo });

      console.log(`[Socket.io] ${participantInfo.name} joined room ${roomCode} (${roomParticipants.size} active)`);
    });

    socket.on('leave-room', () => leaveRoom(socket));

    // WebRTC signaling: only between two people who are in the same room
    const inSameRoom = (targetSocketId) =>
      !!socket.roomCode && !!activeRooms.get(socket.roomCode)?.has(targetSocketId);

    socket.on('offer', ({ targetSocketId, offer, callerInfo } = {}) => {
      if (!inSameRoom(targetSocketId)) return;
      io.to(targetSocketId).emit('offer', { callerSocketId: socket.id, offer, callerInfo });
    });

    socket.on('answer', ({ targetSocketId, answer } = {}) => {
      if (!inSameRoom(targetSocketId)) return;
      io.to(targetSocketId).emit('answer', { responderSocketId: socket.id, answer });
    });

    socket.on('ice-candidate', ({ targetSocketId, candidate } = {}) => {
      if (!inSameRoom(targetSocketId)) return;
      io.to(targetSocketId).emit('ice-candidate', { senderSocketId: socket.id, candidate });
    });

    // Chat (the room comes from the server, so nobody can write into someone else's room)
    socket.on('chat-message', ({ message } = {}) => {
      const roomCode = socket.roomCode;
      if (!roomCode || typeof message !== 'string' || !message.trim()) return;
      const text = message.trim().slice(0, 2000);

      const msgData = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: socket.user?.name || 'Participant',
        senderId: socket.user?.id || socket.id,
        senderAvatar: socket.user?.avatar || '',
        text,
        timestamp: new Date()
      };

      io.to(roomCode).emit('chat-message', msgData);

      // Notify users mentioned with @Name
      findMentionedUsers(text).then((users) => {
        users.forEach((u) => {
          if (String(u._id) === String(socket.user?.id)) return;
          createNotification({
            io,
            userId: u._id,
            type: 'mention',
            title: `${msgData.sender} mentioned you`,
            message: text.slice(0, 120),
            link: `/meetings/room/${roomCode}`,
          });
        });
      }).catch(() => {});

      Meeting.findOneAndUpdate({ roomCode }, { $push: { chatMessages: msgData } }).catch(() => {});
    });

    socket.on('typing', () => {
      if (socket.roomCode) socket.to(socket.roomCode).emit('user-typing', { userName: socket.user?.name });
    });

    socket.on('stop-typing', () => {
      if (socket.roomCode) socket.to(socket.roomCode).emit('user-stop-typing', { userName: socket.user?.name });
    });

    socket.on('media-toggle', ({ audioMuted, videoMuted } = {}) => {
      const roomCode = socket.roomCode;
      if (!roomCode) return;
      const participant = activeRooms.get(roomCode)?.get(socket.id);
      if (participant) {
        if (audioMuted !== undefined) participant.audioMuted = !!audioMuted;
        if (videoMuted !== undefined) participant.videoMuted = !!videoMuted;
      }
      socket.to(roomCode).emit('user-media-toggle', { socketId: socket.id, audioMuted, videoMuted });
    });

    socket.on('screen-share-toggle', ({ isSharing } = {}) => {
      const roomCode = socket.roomCode;
      if (!roomCode) return;
      const participant = activeRooms.get(roomCode)?.get(socket.id);
      if (participant) participant.screenSharing = !!isSharing;
      socket.to(roomCode).emit('user-screen-share', {
        socketId: socket.id,
        userName: socket.user?.name || 'Participant',
        isSharing: !!isSharing
      });
    });

    socket.on('hand-raise-toggle', ({ isRaised } = {}) => {
      const roomCode = socket.roomCode;
      if (!roomCode) return;
      const participant = activeRooms.get(roomCode)?.get(socket.id);
      if (participant) participant.handRaised = !!isRaised;
      io.to(roomCode).emit('user-hand-raise', {
        socketId: socket.id,
        userName: socket.user?.name || 'Participant',
        isRaised: !!isRaised
      });
    });

    socket.on('send-reaction', ({ emoji } = {}) => {
      const roomCode = socket.roomCode;
      if (!roomCode || typeof emoji !== 'string') return;
      io.to(roomCode).emit('receive-reaction', {
        id: `react-${Date.now()}-${Math.random()}`,
        emoji: emoji.slice(0, 8),
        userName: socket.user?.name || 'Participant',
        socketId: socket.id
      });
    });

    // Live transcription: the speaker's name comes from the verified login
    socket.on('send-transcript-chunk', ({ text } = {}) => {
      const roomCode = socket.roomCode;
      if (!roomCode || typeof text !== 'string' || !text.trim()) return;
      const clean = text.trim().slice(0, 1000);

      const chunk = {
        speaker: socket.user?.name || 'Speaker',
        speakerAvatar: socket.user?.avatar || '',
        text: clean,
        timestamp: new Date(),
        sentiment: /great|good|agree/i.test(clean) ? 'positive' : 'neutral',
        confidence: 0.96
      };

      io.to(roomCode).emit('receive-transcript-chunk', chunk);
      Meeting.findOneAndUpdate({ roomCode }, { $push: { transcript: chunk } }).catch(() => {});
    });

    socket.on('ask-ai-copilot', async ({ question, meetingTitle } = {}) => {
      const roomCode = socket.roomCode;
      if (!roomCode || typeof question !== 'string' || !question.trim()) return;
      const response = await AiService.answerMeetingCopilot({
        question: question.slice(0, 500),
        meetingContext: { title: meetingTitle || 'Meeting' }
      });
      io.to(roomCode).emit('ai-copilot-response', {
        question,
        answer: response.answer,
        source: response.source,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      leaveRoom(socket);
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};
