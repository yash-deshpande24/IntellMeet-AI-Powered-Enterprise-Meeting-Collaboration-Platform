import mongoose from 'mongoose';

const actionItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  task: { type: String, required: true },
  assignee: { type: String, default: 'Unassigned' },
  assigneeEmail: { type: String, default: '' },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'converted', 'done'], 
    default: 'pending' 
  },
  convertedTaskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 
  }
});

const transcriptItemSchema = new mongoose.Schema({
  speaker: { type: String, required: true },
  speakerAvatar: { type: String, default: '' },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sentiment: { type: String, default: 'neutral' }, // positive, neutral, concerned
  confidence: { type: Number, default: 0.95 }
});

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Meeting title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hostName: { type: String, default: 'Host' },
  hostAvatar: { type: String, default: '' },
  roomCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  scheduledAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
  duration: {
    type: Number, // in minutes
    default: 30,
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed'],
    default: 'scheduled',
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
  },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String },
    avatar: { type: String },
    joinedAt: { type: Date, default: Date.now },
    talkTimeSeconds: { type: Number, default: 0 }
  }],
  transcript: [transcriptItemSchema],
  summary: {
    executiveSummary: { type: String, default: '' },
    keyDiscussionPoints: [{ type: String }],
    decisionsMade: [{ type: String }],
    actionItems: [actionItemSchema],
    sentimentScore: { type: Number, default: 85 }, // 0 to 100
    overallSentiment: { type: String, default: 'Productive & Positive' },
    speakerAnalytics: [{
      speaker: String,
      percentage: Number,
      wordsCount: Number
    }],
    tags: [{ type: String }],
    generatedAt: { type: Date }
  },
  chatMessages: [{
    sender: { type: String, required: true },
    senderId: { type: String },
    senderAvatar: { type: String },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  recordingUrl: {
    type: String,
    default: '',
  },
  attachments: [{
    name: String,
    url: String,
    uploadedBy: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
});

const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
export default Meeting;
