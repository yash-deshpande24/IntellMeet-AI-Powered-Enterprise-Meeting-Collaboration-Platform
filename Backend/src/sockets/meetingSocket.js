import { AiService } from '../services/aiService.js';
import Meeting from '../models/Meeting.js';
import jwt from 'jsonwebtoken';
import { createNotification, findMentionedUsers } from '../services/notificationService.js';

// Active in-memory room tracking for high-performance WebRTC mesh routing
const activeRooms = new Map();

export const setupMeetingSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join a private room for this user so notifications can be pushed live
    socket.on('register-user', ({ token }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.id) socket.join(`user:${decoded.id}`);
      } catch {
        /* invalid token: ignore */
      }
    });

    // Join meeting room
    socket.on('join-room', async ({ roomCode, user }) => {
      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.user = user;

      if (!activeRooms.has(roomCode)) {
        activeRooms.set(roomCode, new Map());
      }

      const roomParticipants = activeRooms.get(roomCode);
      const participantInfo = {
        socketId: socket.id,
        userId: user?.id || user?._id || socket.id,
        name: user?.name || 'Guest User',
        avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${socket.id}`,
        role: user?.role || 'Member',
        audioMuted: false,
        videoMuted: false,
        screenSharing: false,
        handRaised: false,
        joinedAt: new Date()
      };

      roomParticipants.set(socket.id, participantInfo);

      // Return current participant list to the joining peer
      const existingPeers = Array.from(roomParticipants.values()).filter(p => p.socketId !== socket.id);
      socket.emit('room-peers', {
        participants: existingPeers,
        self: participantInfo
      });

      // Broadcast new user joined to all other peers in the room
      socket.to(roomCode).emit('user-joined', participantInfo);

      console.log(`[Socket.io] User "${participantInfo.name}" (${socket.id}) joined room: ${roomCode}`);
    });

    // WebRTC Signaling: Offer
    socket.on('signal-offer', ({ targetSocketId, offer }) => {
      socket.to(targetSocketId).emit('signal-offer', {
        senderSocketId: socket.id,
        offer
      });
    });

    // WebRTC Signaling: Answer
    socket.on('signal-answer', ({ targetSocketId, answer }) => {
      socket.to(targetSocketId).emit('signal-answer', {
        senderSocketId: socket.id,
        answer
      });
    });

    // WebRTC Signaling: ICE Candidate
    socket.on('signal-ice-candidate', ({ targetSocketId, candidate }) => {
      socket.to(targetSocketId).emit('signal-ice-candidate', {
        senderSocketId: socket.id,
        candidate
      });
    });

    // In-room Chat Message
    socket.on('chat-message', ({ roomCode, message }) => {
      const msgData = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: socket.user?.name || 'Participant',
        senderId: socket.user?.id || socket.id,
        senderAvatar: socket.user?.avatar || '',
        text: message,
        timestamp: new Date()
      };

      io.to(roomCode).emit('chat-message', msgData);

      // Notify users mentioned with @Name
      findMentionedUsers(message).then((users) => {
        users.forEach((u) => {
          if (String(u._id) === String(socket.user?.id)) return;
          createNotification({
            io,
            userId: u._id,
            type: 'mention',
            title: `${msgData.sender} mentioned you`,
            message: String(message).slice(0, 120),
            link: `/meetings/room/${roomCode}`,
          });
        });
      }).catch(() => {});

      // Save to meeting record if available in background
      Meeting.findOneAndUpdate(
        { roomCode },
        { $push: { chatMessages: msgData } }
      ).catch(() => {});
    });

    // Typing Indicators
    socket.on('typing', ({ roomCode, userName }) => {
      socket.to(roomCode).emit('user-typing', { userName: userName || socket.user?.name });
    });

    socket.on('stop-typing', ({ roomCode, userName }) => {
      socket.to(roomCode).emit('user-stop-typing', { userName: userName || socket.user?.name });
    });

    // Media Status Toggle (Mute/Unmute, Video On/Off)
    socket.on('media-toggle', ({ roomCode, audioMuted, videoMuted }) => {
      if (activeRooms.has(roomCode)) {
        const participant = activeRooms.get(roomCode).get(socket.id);
        if (participant) {
          if (audioMuted !== undefined) participant.audioMuted = audioMuted;
          if (videoMuted !== undefined) participant.videoMuted = videoMuted;
        }
      }
      socket.to(roomCode).emit('user-media-toggle', {
        socketId: socket.id,
        audioMuted,
        videoMuted
      });
    });

    // Screen Sharing Toggle
    socket.on('screen-share-toggle', ({ roomCode, isSharing }) => {
      if (activeRooms.has(roomCode)) {
        const participant = activeRooms.get(roomCode).get(socket.id);
        if (participant) participant.screenSharing = isSharing;
      }
      socket.to(roomCode).emit('user-screen-share', {
        socketId: socket.id,
        userName: socket.user?.name || 'Participant',
        isSharing
      });
    });

    // Raise / Lower Hand
    socket.on('hand-raise-toggle', ({ roomCode, isRaised }) => {
      if (activeRooms.has(roomCode)) {
        const participant = activeRooms.get(roomCode).get(socket.id);
        if (participant) participant.handRaised = isRaised;
      }
      io.to(roomCode).emit('user-hand-raise', {
        socketId: socket.id,
        userName: socket.user?.name || 'Participant',
        isRaised
      });
    });

    // Emoji Reactions (Floating Animation)
    socket.on('send-reaction', ({ roomCode, emoji, userName }) => {
      io.to(roomCode).emit('receive-reaction', {
        id: `react-${Date.now()}-${Math.random()}`,
        emoji,
        userName: userName || socket.user?.name || 'Participant',
        socketId: socket.id
      });
    });

    // Live Transcription Streaming
    socket.on('send-transcript-chunk', async ({ roomCode, text, speaker, speakerAvatar }) => {
      const chunk = {
        speaker: speaker || socket.user?.name || 'Speaker',
        speakerAvatar: speakerAvatar || socket.user?.avatar || '',
        text,
        timestamp: new Date(),
        sentiment: text.includes('great') || text.includes('good') || text.includes('agree') ? 'positive' : 'neutral',
        confidence: 0.96
      };

      io.to(roomCode).emit('receive-transcript-chunk', chunk);

      // Persist to meeting transcript array
      Meeting.findOneAndUpdate(
        { roomCode },
        { $push: { transcript: chunk } }
      ).catch(() => {});
    });

    // In-Meeting AI Copilot Query
    socket.on('ask-ai-copilot', async ({ roomCode, question, meetingTitle }) => {
      const response = await AiService.answerMeetingCopilot({
        question,
        meetingContext: { title: meetingTitle || 'Meeting' }
      });

      io.to(roomCode).emit('ai-copilot-response', {
        question,
        answer: response.answer,
        source: response.source,
        timestamp: new Date()
      });
    });

    // Disconnect & Cleanup
    socket.on('disconnect', () => {
      const roomCode = socket.roomCode;
      if (roomCode && activeRooms.has(roomCode)) {
        const roomParticipants = activeRooms.get(roomCode);
        roomParticipants.delete(socket.id);

        socket.to(roomCode).emit('user-left', {
          socketId: socket.id,
          userName: socket.user?.name || 'Participant'
        });

        if (roomParticipants.size === 0) {
          activeRooms.delete(roomCode);
        }
      }
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};
