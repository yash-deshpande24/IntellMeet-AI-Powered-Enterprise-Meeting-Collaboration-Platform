import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser as defaultMockUser } from '../data/mockData';
import { authService } from '../services/authService';

// Create Authentication Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load saved user from localStorage or use initial default mock user
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('intellmeet_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        return defaultMockUser;
      }
    }
    return defaultMockUser;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('intellmeet_token') || 'mock-jwt-token-alex';
  });

  const [loading, setLoading] = useState(false);

  // Sync user state changes with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('intellmeet_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('intellmeet_user');
      localStorage.removeItem('intellmeet_token');
    }
  }, [user]);

  // Helper function to create a readable name from email
  const getNameFromEmail = (email) => {
    if (!email) return defaultMockUser.name;
    const namePart = email.split('@')[0];
    const formatted = namePart
      .split(/[._-]/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return formatted || 'Enterprise Member';
  };

  // Login handler: tries backend API first, falls back gracefully to local mock or auto-accepts @gmail.com
  const login = async (email, password, rememberMe = true) => {
    setLoading(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    const isGmail = cleanEmail.endsWith('@gmail.com');

    // Fast-path for 1-Click Demo Profile
    if (email === 'alex.vance@innovatecorp.com' || email === 'demo@intellmeet.io') {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const demoUser = {
        ...defaultMockUser,
        email: email || defaultMockUser.email,
        name: getNameFromEmail(email),
      };
      const demoToken = 'demo-jwt-token-enterprise';
      setUser(demoUser);
      setToken(demoToken);
      if (rememberMe) {
        localStorage.setItem('intellmeet_token', demoToken);
        localStorage.setItem('intellmeet_user', JSON.stringify(demoUser));
      }
      setLoading(false);
      return { success: true, user: demoUser };
    }

    try {
      // Connect to real backend /api/auth/login
      const result = await authService.login(cleanEmail, password || 'password123');
      if (result?.success && result?.token) {
        setUser(result.user);
        setToken(result.token);
        if (rememberMe) {
          localStorage.setItem('intellmeet_token', result.token);
          localStorage.setItem('intellmeet_user', JSON.stringify(result.user));
        }
        setLoading(false);
        return { success: true, user: result.user };
      }
    } catch (err) {
      console.warn('[AuthContext] Backend auth unavailable or invalid, evaluating fallback mode:', err.message);

      // If email ends with @gmail.com, ALWAYS accept and grant instant access!
      if (isGmail) {
        const gmailUser = {
          ...defaultMockUser,
          id: 'usr-gmail-' + Math.abs(cleanEmail.split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0)),
          email: cleanEmail,
          name: getNameFromEmail(cleanEmail),
          role: 'Enterprise Member',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
        };
        const gmailToken = 'jwt-token-gmail-' + Date.now();
        setUser(gmailUser);
        setToken(gmailToken);
        if (rememberMe) {
          localStorage.setItem('intellmeet_token', gmailToken);
          localStorage.setItem('intellmeet_user', JSON.stringify(gmailUser));
        }
        setLoading(false);
        return { success: true, user: gmailUser };
      }

      // If error is network related (e.g. backend server offline), allow graceful mock fallback
      if (err.message.includes('Network Error') || err.message.includes('timeout') || err.message.includes('ECONNREFUSED')) {
        const fallbackUser = {
          ...defaultMockUser,
          email: cleanEmail || defaultMockUser.email,
          name: getNameFromEmail(cleanEmail),
        };
        const fallbackToken = 'jwt-token-fallback-' + Date.now();
        setUser(fallbackUser);
        setToken(fallbackToken);
        if (rememberMe) {
          localStorage.setItem('intellmeet_token', fallbackToken);
          localStorage.setItem('intellmeet_user', JSON.stringify(fallbackUser));
        }
        setLoading(false);
        return { success: true, user: fallbackUser };
      }
      setLoading(false);
      throw err;
    }
  };

  // Sign up handler: tries backend API first, falls back to local user on network failure or @gmail.com
  const signup = async ({ name, email, password, department, title }) => {
    setLoading(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    const isGmail = cleanEmail.endsWith('@gmail.com');
    const effectiveName = name?.trim() || getNameFromEmail(cleanEmail);

    try {
      const result = await authService.register({
        name: effectiveName,
        email: cleanEmail,
        password: password || 'password123',
        department,
        title,
      });
      if (result?.success && result?.token) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem('intellmeet_token', result.token);
        localStorage.setItem('intellmeet_user', JSON.stringify(result.user));
        setLoading(false);
        return { success: true, user: result.user };
      }
    } catch (err) {
      console.warn('[AuthContext] Backend registration unavailable, using fallback:', err.message);
      if (isGmail || err.message.includes('Network Error') || err.message.includes('timeout') || err.message.includes('ECONNREFUSED')) {
        const newUser = {
          ...defaultMockUser,
          id: 'usr-' + Date.now(),
          name: effectiveName,
          email: cleanEmail,
          role: 'Enterprise Member',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
        };
        const generatedToken = 'jwt-token-' + Date.now();
        setUser(newUser);
        setToken(generatedToken);
        localStorage.setItem('intellmeet_token', generatedToken);
        localStorage.setItem('intellmeet_user', JSON.stringify(newUser));
        setLoading(false);
        return { success: true, user: newUser };
      }
      setLoading(false);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('intellmeet_user');
    localStorage.removeItem('intellmeet_token');
  };

  // Forgot password request
  const forgotPassword = async (email) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);
    return { success: true, message: `Password reset link sent to ${email}` };
  };

  // Reset password handler
  const resetPassword = async (newPassword) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    return { success: true, message: 'Password has been updated successfully' };
  };

  // Verify email code
  const verifyEmail = async (code) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    return { success: true, message: 'Email verified successfully' };
  };

  // Update user profile fields
  const updateProfile = (fields) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...fields };
      localStorage.setItem('intellmeet_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
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

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
