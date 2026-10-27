import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { setupMeetingSocket } from './sockets/meetingSocket.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { initSentry, attachErrorHandlers } from './monitoring/sentry.js';
import { metricsMiddleware, metricsHandler, trackSockets } from './monitoring/metrics.js';

import authRoutes from './routes/authRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import User from './models/User.js';
import Workspace from './models/Workspace.js';
import Meeting from './models/Meeting.js';
import Task from './models/Task.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config(); // shared defaults from Backend/.env
dotenv.config({ path: path.join(__dirname, '../.env.local'), override: true }); // your private overrides (git-ignored)

initSentry(); // Day 26: error tracking (only active when SENTRY_DSN is set)

const isProduction = process.env.NODE_ENV === 'production';
let httpsOrigin = process.env.HTTPS_ORIGIN;
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured in the backend environment.');
}
if (isProduction) {
  try {
    const parsedOrigin = new URL(httpsOrigin || '');
    if (
      parsedOrigin.protocol !== 'https:' || parsedOrigin.username || parsedOrigin.password ||
      parsedOrigin.pathname !== '/' || parsedOrigin.search || parsedOrigin.hash
    ) {
      throw new Error();
    }
    httpsOrigin = parsedOrigin.origin;
  } catch {
    throw new Error('HTTPS_ORIGIN must be an HTTPS origin without a path in production.');
  }
}

const app = express();
const server = http.createServer(app);
if (isProduction) {
  const trustProxy = process.env.TRUST_PROXY || '1';
  app.set('trust proxy', /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);
}

// Cross-Origin configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
  }
});

// Make Socket.io available inside controllers (req.app.get('io'))
app.set('io', io);

trackSockets(io); // Day 26: socket gauge

// Middleware
app.use(helmet({
  hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true } : false,
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"]
    }
  }
}));
// Day 27 (ZAP findings): Permissions-Policy and no caching of API responses
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=()');
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use((req, res, next) => {
  if (isProduction && !req.secure && req.path !== '/api/health') {
    return res.redirect(308, `${httpsOrigin}${req.originalUrl}`);
  }
  next();
});
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(morgan('dev'));
app.use(metricsMiddleware); // Day 26: request metrics

// Rate Limiting
app.use('/api/', apiLimiter);

// Setup WebRTC and Chat Socket
setupMeetingSocket(io);

// Prometheus metrics (set METRICS_TOKEN to protect it)
app.get('/metrics', metricsHandler);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Friendly root route
app.get('/', (req, res) => {
  res.json({
    name: 'IntellMeet API',
    status: 'running',
    health: '/api/health',
    frontend: 'https://intell-meet-ai-powered-enterprise-m-ebon.vercel.app'
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    name: 'IntellMeet Enterprise Collaboration Engine',
    timestamp: new Date(),
    version: '1.0.0',
    freeTierServices: {
      mongoAtlas: 'Supported / Fallback-Ready',
      webrtc: 'Native Peer-to-Peer Enabled',
      aiEngine: process.env.OPENAI_API_KEY ? 'OpenAI / HuggingFace Connected' : 'High-Precision Fallback NLP Active',
      storage: process.env.CLOUDINARY_CLOUD_NAME ? 'Cloudinary Free Tier' : 'Data URI / Base64 Safe Storage'
    }
  });
});

// Day 26: optional route to prove Sentry works (enable with ENABLE_DEBUG_ROUTES=true)
if (process.env.ENABLE_DEBUG_ROUTES === 'true') {
  app.get('/debug-sentry', () => {
    throw new Error('Test error from /debug-sentry');
  });
}

// Day 26: must come after every route
attachErrorHandlers(app);

// Automatic Seed Function for Quick Demo & Evaluation
const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seed] Seeding default enterprise accounts...');
      
      const admin = await User.create({
        name: 'Sarah Connor',
        email: 'admin@intellmeet.io',
        password: 'password123',
        role: 'Admin',
        department: 'Executive Engineering',
        title: 'VP of Engineering',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      });

      const member = await User.create({
        name: 'Alex Rivera',
        email: 'member@intellmeet.io',
        password: 'password123',
        role: 'Member',
        department: 'Platform Architecture',
        title: 'Lead Distributed Systems Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      });

      const workspace = await Workspace.create({
        name: 'Core Platform Engineering',
        description: 'Next-generation real-time WebRTC and AI meeting collaboration stream.',
        owner: admin._id,
        color: '#6366f1',
        icon: 'Layers',
        isDefault: true,
        members: [
          { user: admin._id, role: 'Owner', name: admin.name, email: admin.email, avatar: admin.avatar },
          { user: member._id, role: 'Member', name: member.name, email: member.email, avatar: member.avatar }
        ]
      });

      const sampleMeeting = await Meeting.create({
        title: 'Q3 Enterprise Architecture & AI Copilot Review',
        description: 'Quarterly review of WebRTC mesh stability, AI summarization pipeline, and Kanban integration.',
        host: admin._id,
        hostName: admin.name,
        hostAvatar: admin.avatar,
        roomCode: 'int-arch-sync-2026',
        duration: 45,
        status: 'completed',
        workspaceId: workspace._id,
        scheduledAt: new Date(Date.now() - 2 * 3600000),
        endedAt: new Date(Date.now() - 1 * 3600000),
        participants: [
          { user: admin._id, name: admin.name, email: admin.email, avatar: admin.avatar, talkTimeSeconds: 1420 },
          { user: member._id, name: member.name, email: member.email, avatar: member.avatar, talkTimeSeconds: 980 }
        ],
        transcript: [
          { speaker: admin.name, text: "Good morning team. Today we are validating our WebRTC peer-to-peer audio/video mesh and zero-cost AI fallback engine.", timestamp: new Date(Date.now() - 110 * 60000), sentiment: "positive" },
          { speaker: member.name, text: "The WebRTC mesh latency tests look incredible—under 45ms across all local testing nodes.", timestamp: new Date(Date.now() - 105 * 60000), sentiment: "positive" },
          { speaker: admin.name, text: "Alex, please make sure the action item auto-converter links directly to our Kanban project board.", timestamp: new Date(Date.now() - 100 * 60000), sentiment: "neutral" },
          { speaker: member.name, text: "I'll also verify Cloudinary free tier avatar uploads and responsive layouts.", timestamp: new Date(Date.now() - 95 * 60000), sentiment: "positive" }
        ],
        summary: {
          executiveSummary: "Strategic review of IntellMeet architecture, WebRTC peer-to-peer performance, and AI-driven automated task synthesis. The team confirmed 100% free-tier deployment readiness and verified real-time transcription workflows.",
          keyDiscussionPoints: [
            "WebRTC peer-to-peer mesh latency performance verified under 45ms.",
            "AI post-meeting summary extraction pipeline validated with zero paid API dependencies.",
            "Integrated action-item-to-Kanban automated task conversion."
          ],
          decisionsMade: [
            "Approved the full monorepo architecture with TanStack Query and Zustand.",
            "Selected Tailwind CSS v4 for enterprise glassmorphic design aesthetics."
          ],
          actionItems: [
            { id: 'act-demo-1', task: 'Connect AI post-meeting summary hooks to Kanban workspace board', assignee: 'Alex Rivera', priority: 'urgent', dueDate: new Date(Date.now() + 2 * 86400000), status: 'converted' },
            { id: 'act-demo-2', task: 'Conduct security audit on JWT token expiration and express-rate-limit', assignee: 'Sarah Connor', priority: 'high', dueDate: new Date(Date.now() + 4 * 86400000), status: 'pending' },
            { id: 'act-demo-3', task: 'Validate Cloudinary free tier avatar asset storage', assignee: 'Alex Rivera', priority: 'medium', dueDate: new Date(Date.now() + 5 * 86400000), status: 'pending' }
          ],
          sentimentScore: 94,
          overallSentiment: 'Highly Productive & Energized',
          speakerAnalytics: [
            { speaker: 'Sarah Connor', percentage: 59, wordsCount: 520 },
            { speaker: 'Alex Rivera', percentage: 41, wordsCount: 360 }
          ],
          tags: ['Architecture', 'WebRTC', 'AI Summaries', 'Enterprise Ready'],
          generatedAt: new Date()
        }
      });

      // Seed Initial Kanban Tasks
      await Task.create([
        {
          title: 'Connect AI post-meeting summary hooks to Kanban workspace board',
          description: 'Auto-extracted from meeting "Q3 Enterprise Architecture & AI Copilot Review".',
          status: 'in-progress',
          priority: 'urgent',
          assignee: 'Alex Rivera',
          creator: admin._id,
          workspaceId: workspace._id,
          workspaceName: workspace.name,
          meetingId: sampleMeeting._id,
          dueDate: new Date(Date.now() + 2 * 86400000),
          tags: ['AI Action Item', 'Meeting Sync']
        },
        {
          title: 'Design high-fidelity dark mode video conferencing room UI',
          description: 'Build sleek participant grid with audio/video toggles, screen share, and AI side panel.',
          status: 'done',
          priority: 'high',
          assignee: 'Sarah Connor',
          creator: admin._id,
          workspaceId: workspace._id,
          workspaceName: workspace.name,
          dueDate: new Date(Date.now() + 1 * 86400000),
          tags: ['Frontend', 'UI/UX']
        },
        {
          title: 'Implement WebRTC mesh signaling with Socket.io',
          description: 'Full SDP offer/answer exchange, ICE candidate routing, and peer connection pool.',
          status: 'done',
          priority: 'urgent',
          assignee: 'Alex Rivera',
          creator: admin._id,
          workspaceId: workspace._id,
          workspaceName: workspace.name,
          dueDate: new Date(Date.now() + 1 * 86400000),
          tags: ['WebRTC', 'Real-Time']
        },
        {
          title: 'Create interactive meeting analytics and productivity charts',
          description: 'Show meeting frequency, hours saved by AI, and task completion velocity.',
          status: 'todo',
          priority: 'medium',
          assignee: 'Sarah Connor',
          creator: admin._id,
          workspaceId: workspace._id,
          workspaceName: workspace.name,
          dueDate: new Date(Date.now() + 5 * 86400000),
          tags: ['Analytics', 'Dashboard']
        },
        {
          title: 'Conduct rate-limiting and JWT security penetration audit',
          description: 'Ensure brute-force protection and strict role-based access control.',
          status: 'backlog',
          priority: 'low',
          assignee: 'Unassigned',
          creator: admin._id,
          workspaceId: workspace._id,
          workspaceName: workspace.name,
          dueDate: new Date(Date.now() + 7 * 86400000),
          tags: ['Security', 'Compliance']
        }
      ]);

      console.log('[Seed] Demo accounts & initial enterprise data populated successfully!');
    }
  } catch (err) {
    console.warn('[Seed] Notice on seeding:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await connectDB();
  if (dbConnected && (process.env.NODE_ENV === 'development' || process.env.SEED_DEMO_DATA === 'true')) {
    await seedInitialData();
  }

  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 IntellMeet Enterprise Server running on port ${PORT}`);
    console.log(`📡 Socket.io WebRTC signaling endpoint active`);
    console.log(`🤖 AI Meeting Intelligence Engine: ONLINE`);
    console.log(`====================================================`);
  });
};

startServer();
