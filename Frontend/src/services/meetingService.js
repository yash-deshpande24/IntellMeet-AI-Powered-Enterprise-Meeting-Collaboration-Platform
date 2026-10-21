import api from './api';

// List meetings (newest first). Example: getMeetings({ status: 'completed', limit: 20 })
export const getMeetings = async (params = {}) => {
  const res = await api.get('/meetings', { params });
  return res.data.meetings;
};

// Get one meeting by its database _id
export const getMeetingById = async (id) => {
  const res = await api.get(`/meetings/${id}`);
  return res.data.meeting;
};

// Get a meeting by room code (backend creates it if it does not exist)
export const getMeetingByCode = async (code) => {
  const res = await api.get(`/meetings/code/${encodeURIComponent(code)}`);
  return res.data.meeting;
};

// Generate (or regenerate) the AI summary from the saved transcript
export const generateSummary = async (id) => {
  const res = await api.post(`/meetings/${id}/ai-summary`);
  return res.data.summary;
};

// Change status: 'scheduled' | 'active' | 'completed'
export const updateMeetingStatus = async (id, status) => {
  const res = await api.patch(`/meetings/${id}/status`, { status });
  return res.data.meeting;
};

// Turn an AI action item into a Kanban task
export const convertActionItem = async (meetingId, actionItemId, payload = {}) => {
  const res = await api.post(
    `/meetings/${meetingId}/action-items/${actionItemId}/convert`,
    payload
  );
  return res.data.task;
};