import api from './api';

export const authService = {
  // Login with enterprise credentials
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Register a new enterprise team member
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Retrieve current user profile
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile details
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Upload user avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // List all users in organization
  getAllUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
};

export default authService;
