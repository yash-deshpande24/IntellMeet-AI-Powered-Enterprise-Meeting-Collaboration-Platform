import api from './api';

export const analyticsService = {
  getPlatformAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
};

export default analyticsService;
