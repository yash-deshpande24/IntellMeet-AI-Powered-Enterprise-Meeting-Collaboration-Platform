import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser as initialMockUser } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('intellmeet_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialMockUser;
      }
    }
    // Default to mock logged in user for immediate seamless evaluation
    return initialMockUser;
  });

  const [token, setToken] = useState(() => localStorage.getItem('intellmeet_token') || 'mock_enterprise_jwt_token_2026');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('intellmeet_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('intellmeet_user');
      localStorage.removeItem('intellmeet_token');
    }
  }, [user]);

  const login = async (email, password, rememberMe = true) => {
    setLoading(true);
    // Simulate API network roundtrip
    await new Promise((res) => setTimeout(res, 800));
    const loggedUser = {
      ...initialMockUser,
      email: email || initialMockUser.email,
      name: email.split('@')[0].replace('.', ' ').replace(/(^|\s)\S/g, l => l.toUpperCase()) || initialMockUser.name,
    };
    const mockToken = 'jwt_' + Math.random().toString(36).substring(2);
    setUser(loggedUser);
    setToken(mockToken);
    if (rememberMe) {
      localStorage.setItem('intellmeet_token', mockToken);
      localStorage.setItem('intellmeet_user', JSON.stringify(loggedUser));
    }
    setLoading(false);
    return { success: true, user: loggedUser };
  };

  const signup = async ({ name, email, password }) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 900));
    const newUser = {
      ...initialMockUser,
      id: 'usr_' + Date.now(),
      name,
      email,
      role: 'Enterprise Member',
    };
    const mockToken = 'jwt_' + Math.random().toString(36).substring(2);
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem('intellmeet_token', mockToken);
    localStorage.setItem('intellmeet_user', JSON.stringify(newUser));
    setLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('intellmeet_user');
    localStorage.removeItem('intellmeet_token');
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 700));
    setLoading(false);
    return { success: true, message: `Password reset instructions sent to ${email}` };
  };

  const resetPassword = async (newPassword) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    return { success: true, message: 'Password has been successfully updated' };
  };

  const verifyEmail = async (code) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 600));
    setLoading(false);
    return { success: true, message: 'Email address verified successfully' };
  };

  const updateProfile = (fields) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem('intellmeet_user', JSON.stringify(updated));
      return updated;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
