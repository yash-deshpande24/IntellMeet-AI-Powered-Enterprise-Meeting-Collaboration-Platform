import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['backlog', 'todo', 'in-progress', 'review', 'done'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  assignee: {
    type: String,
    default: 'Unassigned',
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assigneeAvatar: {
    type: String,
    default: '',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
  },
  workspaceName: {
    type: String,
    default: 'General Enterprise Board',
  },
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
  },
  meetingTitle: {
    type: String,
  },
  actionItemId: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
  tags: [{
    type: String,
  }],
  order: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
