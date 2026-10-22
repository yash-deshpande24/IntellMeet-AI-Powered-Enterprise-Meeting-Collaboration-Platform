import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import * as socketModule from '../../services/socket';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const resolveSocket = () => {
  const s = socketModule.default ?? socketModule.socket ?? null;
  return typeof s === 'function' ? s() : s;
};

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  return `${Math.floor(seconds / 86400)} d ago`;
};

const typeIcon = {
  'task-assigned': '📌',
  'action-item': '✅',
  mention: '💬',
  'summary-ready': '✨',
  system: '🔔',
};

export const NotificationBell = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { info } = useNotification();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await getNotifications();
      setItems(data.notifications);
      setUnread(data.unreadCount);
    } catch {
      /* not logged in yet, ignore */
    }
  }, []);

  // Initial load + slow polling as a safety net
  useEffect(() => {
    if (!token) return;
    load();
    const timer = setInterval(load, 60000);
    return () => clearInterval(timer);
  }, [token, load]);

  // Live updates through the socket
  useEffect(() => {
    const socket = resolveSocket();
    if (!socket || !token) return;

    const register = () => socket.emit('register-user', { token });
    if (socket.disconnected && socket.connect) socket.connect();
    if (socket.connected) register();
    socket.on('connect', register);

    const onNew = (n) => {
      setItems((prev) => [n, ...prev].slice(0, 30));
      setUnread((c) => c + 1);
      info(n.title);
    };
    socket.on('notification:new', onNew);

    return () => {
      socket.off('connect', register);
      socket.off('notification:new', onNew);
    };
  }, [token, info]);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = async (n) => {
    if (!n.read) {
      await markNotificationRead(n._id).catch(() => {});
      setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
      setUnread((c) => Math.max(0, c - 1));
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead().catch(() => {});
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    setUnread(0);
  };

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
            <button
              onClick={handleReadAll}
              className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          </div>

          {items.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-500">You are all caught up.</p>
          ) : (
            items.map((n) => (
              <button
                key={n._id}
                onClick={() => handleClick(n)}
                className={`w-full text-left px-4 py-3 flex gap-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                  n.read ? 'opacity-60' : ''
                }`}
              >
                <span className="text-lg">{typeIcon[n.type] || '🔔'}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">{n.title}</span>
                  <span className="block text-[11px] text-slate-600 dark:text-slate-400 truncate">{n.message}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</span>
                </span>
                {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};