import api from './api';

export const workspaceService = {
  getWorkspaces: async () => {
    const response = await api.get('/workspaces');
    return response.data;
  },

  createWorkspace: async (workspaceData) => {
    const response = await api.post('/workspaces', workspaceData);
    return response.data;
  },
};

export default workspaceService;
