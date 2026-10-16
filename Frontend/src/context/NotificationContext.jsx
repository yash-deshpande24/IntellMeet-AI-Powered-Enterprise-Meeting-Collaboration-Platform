import React, { createContext, useContext, useState } from 'react';

// Create Notification Context
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast notification
  const addToast = ({ type = 'info', title = '', message = '', duration = 4000 }) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const newToast = { id, type, title, message };

    // Append new toast to list
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Automatically remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  // Remove toast by id
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Helper shortcuts for common alert types
  const success = (message, title = 'Success') => {
    return addToast({ type: 'success', title, message });
  };

  const error = (message, title = 'Error') => {
    return addToast({ type: 'error', title, message });
  };

  const info = (message, title = 'Notice') => {
    return addToast({ type: 'info', title, message });
  };

  const warning = (message, title = 'Warning') => {
    return addToast({ type: 'warning', title, message });
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
