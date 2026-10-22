import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['task-assigned', 'action-item', 'mention', 'summary-ready', 'system'],
    default: 'system',
  },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  link: { type: String, default: '' },
  read: { type: Boolean, default: false },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, {
  timestamps: true,
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;