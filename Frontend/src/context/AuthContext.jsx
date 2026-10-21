import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// Tokens created by the old mock login are not real, so ignore them
const isFakeToken = (t) => !t || t.startsWith('jwt-token-') || t.startsWith('mock-');

const readSavedAuth = () => {
  try {
    const token = localStorage.getItem('intellmeet_token');
    const user = JSON.parse(localStorage.getItem('intellmeet_user') || 'null');
    if (isFakeToken(token) || !user) {
      localStorage.removeItem('intellmeet_token');
      localStorage.removeItem('intellmeet_user');
      return { token: null, user: null };
    }
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const saved = readSavedAuth();
  const [user, setUser] = useState(saved.user);
  const [token, setToken] = useState(saved.token);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('intellmeet_user', JSON.stringify(user));
    else localStorage.removeItem('intellmeet_user');
  }, [user]);

  const saveSession = (newToken, newUser) => {
    localStorage.setItem('intellmeet_token', newToken);
    localStorage.setItem('intellmeet_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // REAL login against the backend
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      saveSession(res.data.token, res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // REAL signup against the backend (password must be 8+ characters)
  const signup = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      saveSession(res.data.token, res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('intellmeet_user');
    localStorage.removeItem('intellmeet_token');
  };

  // The three below are still simulated (no backend routes for them yet)
  const forgotPassword = async (email) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    return { success: true, message: `Password reset link sent to ${email}` };
  };

  const resetPassword = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    return { success: true, message: 'Password has been updated successfully' };
  };

  const verifyEmail = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    return { success: true, message: 'Email verified successfully' };
  };

  const updateProfile = (fields) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};