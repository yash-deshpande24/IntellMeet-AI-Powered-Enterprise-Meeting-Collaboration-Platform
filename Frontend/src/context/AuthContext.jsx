import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser as defaultMockUser } from '../data/mockData';

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
    return namePart
      .split('.')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Login handler
  const login = async (email, password, rememberMe = true) => {
    setLoading(true);

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const loggedInUser = {
      ...defaultMockUser,
      email: email || defaultMockUser.email,
      name: getNameFromEmail(email),
    };

    const generatedToken = 'jwt-token-' + Date.now();

    setUser(loggedInUser);
    setToken(generatedToken);

    if (rememberMe) {
      localStorage.setItem('intellmeet_token', generatedToken);
      localStorage.setItem('intellmeet_user', JSON.stringify(loggedInUser));
    }

    setLoading(false);
    return { success: true, user: loggedInUser };
  };

  // Sign up handler
  const signup = async ({ name, email, password }) => {
    setLoading(true);

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    const newUser = {
      ...defaultMockUser,
      id: 'usr-' + Date.now(),
      name: name || 'New User',
      email: email,
      role: 'Enterprise Member',
    };

    const generatedToken = 'jwt-token-' + Date.now();

    setUser(newUser);
    setToken(generatedToken);

    localStorage.setItem('intellmeet_token', generatedToken);
    localStorage.setItem('intellmeet_user', JSON.stringify(newUser));

    setLoading(false);
    return { success: true, user: newUser };
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
