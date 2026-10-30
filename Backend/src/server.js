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
dotenv.config({ path: path.join(__dirname, '../.env.local'), override: true }); // private overrides

initSentry(); // error tracking

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

// Make Socket.io available inside controllers
app.set('io', io);
trackSockets(io);

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
app.use(metricsMiddleware);

// Rate Limiting
app.use('/api/', apiLimiter);

// Setup WebRTC and Chat Socket
setupMeetingSocket(io);

// Prometheus metrics
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

if (process.env.ENABLE_DEBUG_ROUTES === 'true') {
  app.get('/debug-sentry', () => {
    throw new Error('Test error from /debug-sentry');
  });
}

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
        roomCode: 'int-arc-772-990',
        scheduledAt: new Date(),
        duration: 45,
        status: 'completed',
        workspaceId: workspace._id,
        participants: [
          { user: admin._id, name: admin.name, email: admin.email, avatar: admin.avatar, role: 'Admin' },
          { user: member._id, name: member.name, email: member.email, avatar: member.avatar, role: 'Member' }
        ],
        transcript: [
          { speaker: 'Sarah Connor', text: 'Welcome everyone. Today we evaluate our zero-dependency WebRTC mesh and AI pipeline.', timestamp: new Date(Date.now() - 40 * 60000), sentiment: 'positive' },
          { speaker: 'Alex Rivera', text: 'I have finalized the socket routing mesh. All clients stay synchronized at sub-50ms latency.', timestamp: new Date(Date.now() - 35 * 60000), sentiment: 'positive' },
          { speaker: 'Sarah Connor', text: 'Excellent work. Next priority is connecting the AI post-meeting summary hooks to our Kanban board.', timestamp: new Date(Date.now() - 25 * 60000), sentiment: 'neutral' },
          { speaker: 'Alex Rivera', text: 'Agreed. Action items can now be converted to draggable Kanban tasks with one click.', timestamp: new Date(Date.now() - 15 * 60000), sentiment: 'positive' }
        ],
        summary: {
          executiveSummary: 'The engineering team successfully validated the WebRTC real-time peer mesh and integrated AI post-meeting intelligence with zero paid external API dependencies. Key milestones include sub-50ms peer signaling, real-time transcription, and automated Kanban action item sync.',
          keyDiscussionPoints: [
            'WebRTC P2P mesh performance and latency verification (<50ms)',
            'AI post-meeting executive summary and sentiment score generation',
            'Seamless action item conversion directly into Kanban tasks',
            'Fallback data mode ensuring 100% functionality without MongoDB or Cloudinary fees'
          ],
          decisionsMade: [
            'Deploy full stack with graceful fallback support active across all environments',
            'Adopt native browser SpeechRecognition API with intelligent server-side synthesis',
            'Default enterprise users to automated Kanban synchronization workflow'
          ],
          actionItems: [
            { id: 'act-demo-1', task: 'Connect AI post-meeting summary hooks to Kanban workspace board', assignee: 'Alex Rivera', priority: 'urgent', dueDate: new Date(Date.now() + 2 * 86400000), status: 'converted' },
            { id: 'act-demo-2', task: 'Finalize Cloudinary free-tier media integration & base64 avatar fallback', assignee: 'Sarah Connor', priority: 'high', dueDate: new Date(Date.now() + 4 * 86400000), status: 'pending' },
            { id: 'act-demo-3', task: 'Conduct end-to-end multi-peer WebRTC mesh stress test', assignee: 'Alex Rivera', priority: 'medium', dueDate: new Date(Date.now() + 5 * 86400000), status: 'pending' }
          ],
          sentimentScore: 92,
          overallSentiment: 'Decisive & Highly Aligned',
          speakerAnalytics: [
            { speaker: 'Sarah Connor', wordCount: 210, talkTimePercentage: 45, sentimentRatio: { positive: 0.7, neutral: 0.3, negative: 0 } },
            { speaker: 'Alex Rivera', wordCount: 255, talkTimePercentage: 55, sentimentRatio: { positive: 0.85, neutral: 0.15, negative: 0 } }
          ],
          tags: ['Sprint Review', 'WebRTC Architecture', 'AI Intelligence', 'Enterprise']
        }
      });

      await Task.create([
        {
          title: 'Connect AI post-meeting summary hooks to Kanban workspace board',
          description: 'Ensure converted action items from meetings immediately populate the To Do column with priority badges.',
          status: 'in-progress',
          priority: 'urgent',
          assignee: 'Alex Rivera',
          creator: admin._id,
          workspaceId: workspace._id,
          workspaceName: workspace.name,
          meetingId: sampleMeeting._id,
          meetingTitle: sampleMeeting.title,
          dueDate: new Date(Date.now() + 2 * 86400000),
          tags: ['AI Action Item', 'Priority']
        },
        {
          title: 'Finalize Cloudinary free-tier media integration & base64 avatar fallback',
          description: 'Provide persistent profile pictures without requiring paid cloud hosting buckets.',
          status: 'todo',
          priority: 'high',
          assignee: 'Sarah Connor',
          creator: admin._id,
          workspaceId: workspace._id,
          workspaceName: workspace.name,
          dueDate: new Date(Date.now() + 4 * 86400000),
          tags: ['Storage', 'Cloudinary']
        },
        {
          title: 'Conduct end-to-end multi-peer WebRTC mesh stress test',
          description: 'Test concurrent video and audio tracks with simulated bandwidth constraints.',
          status: 'todo',
          priority: 'medium',
          assignee: 'Alex Rivera',
          creator: admin._id,
          workspaceId: workspace._id,
          workspaceName: workspace.name,
          dueDate: new Date(Date.now() + 5 * 86400000),
          tags: ['WebRTC', 'QA']
        },
        {
          title: 'Publish interactive API Swagger & Postman collections',
          description: 'Document REST routes, Socket.io signaling protocols, and JWT token authentication.',
          status: 'done',
          priority: 'low',
          assignee: 'Sarah Connor',
          creator: admin._id,
          workspaceId: workspace._id,
          workspaceName: workspace.name,
          dueDate: new Date(Date.now() - 1 * 86400000),
          tags: ['Documentation']
        },
        {
          title: 'Implement enterprise workspace member invite & role governance',
          description: 'Add Admin and Member role enforcement with JWT token claims.',
          status: 'done',
          priority: 'high',
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
