import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workspace name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  color: {
    type: String,
    default: '#3b82f6',
  },
  icon: {
    type: String,
    default: 'Briefcase',
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Owner', 'Admin', 'Member'], default: 'Member' },
    name: String,
    email: String,
    avatar: String
  }],
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

const Workspace = mongoose.models.Workspace || mongoose.model('Workspace', workspaceSchema);
export default Workspace;
