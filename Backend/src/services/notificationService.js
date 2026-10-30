import Notification from '../models/Notification.js';
import User from '../models/User.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Save a notification and push it live to the user's socket room.
 * io is optional: without it the notification is only saved.
 */
export const createNotification = async ({
  io,
  userId,
  type = 'system',
  title,
  message = '',
  link = '',
  meta = {},
}) => {
  if (!userId) return null;
  try {
    const notification = await Notification.create({ user: userId, type, title, message, link, meta });
    if (io) io.to(`user:${userId}`).emit('notification:new', notification);
    return notification;
  } catch (err) {
    console.warn('[Notification] could not create:', err.message);
    return null;
  }
};

/**
 * Find a user from a name such as "Alex Rivera" or just "Alex".
 */
export const findUserByName = async (name) => {
  if (!name || typeof name !== 'string' || name.trim().toLowerCase() === 'unassigned') return null;
  const clean = name.trim();
  const exact = await User.findOne({ name: new RegExp(`^${escapeRegex(clean)}$`, 'i') });
  if (exact) return exact;
  return User.findOne({ name: new RegExp(`^${escapeRegex(clean)}\\b`, 'i') });
};

/**
 * Find users mentioned with @ in a chat message: "@Alex" or "@Alex Rivera".
 */
export const findMentionedUsers = async (text = '') => {
  if (!text.includes('@')) return [];
  const users = await User.find().select('name');
  const lower = text.toLowerCase();
  return users.filter((u) => {
    const full = u.name.toLowerCase();
    const first = full.split(' ')[0];
    return lower.includes(`@${full}`) || new RegExp(`@${escapeRegex(first)}\\b`).test(lower);
  });
};