import api from './api';

/* ------------------------------------------------------------------
 * 1) Team version: object style. Each method returns the full response
 *    body, for example { success, meeting }.
 *    Usage: meetingService.getMeetingById(id)
 * ------------------------------------------------------------------ */
export const meetingService = {
  // Get all meetings (optional status filter: 'scheduled' | 'active' | 'completed')
  getMeetings: async (params = {}) => {
    const response = await api.get('/meetings', { params });
    return response.data;
  },

  // Get or ad-hoc initialize meeting by room code
  getMeetingByCode: async (code) => {
    const response = await api.get(`/meetings/code/${code}`);
    return response.data;
  },

  // Get meeting details by Mongo ID
  getMeetingById: async (id) => {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  },

  // Schedule or instantly launch a meeting
  createMeeting: async (meetingData) => {
    const response = await api.post('/meetings', meetingData);
    return response.data;
  },

  // Update meeting status (e.g. 'active', 'completed')
  updateMeetingStatus: async (id, status) => {
    const response = await api.patch(`/meetings/${id}/status`, { status });
    return response.data;
  },

  // Trigger AI generation of Executive Summary, Action Items & Sentiment
  triggerAiSummary: async (id) => {
    const response = await api.post(`/meetings/${id}/ai-summary`);
    return response.data;
  },

  // Append a live transcript chunk to meeting record
  saveTranscriptItem: async (id, transcriptItem) => {
    const response = await api.post(`/meetings/${id}/transcript`, transcriptItem);
    return response.data;
  },

  // Convert an extracted AI action item into a workspace Kanban task
  convertActionItemToTask: async (meetingId, actionItemId) => {
    const response = await api.post(`/meetings/${meetingId}/action-items/${actionItemId}/convert`);
    return response.data;
  },
};

/* ------------------------------------------------------------------
 * 2) Post-meeting dashboard helpers: named functions that return the
 *    useful part directly (the meeting, the list, the summary...).
 *    Usage: const meeting = await getMeetingById(id)
 * ------------------------------------------------------------------ */
export const getMeetings = async (params = {}) => {
  const res = await api.get('/meetings', { params });
  return res.data.meetings;
};

export const getMeetingById = async (id) => {
  const res = await api.get(`/meetings/${id}`);
  return res.data.meeting;
};

export const getMeetingByCode = async (code) => {
  const res = await api.get(`/meetings/code/${encodeURIComponent(code)}`);
  return res.data.meeting;
};

export const generateSummary = async (id) => {
  const res = await api.post(`/meetings/${id}/ai-summary`);
  return res.data.summary;
};

export const updateMeetingStatus = async (id, status) => {
  const res = await api.patch(`/meetings/${id}/status`, { status });
  return res.data.meeting;
};

export const convertActionItem = async (meetingId, actionItemId, payload = {}) => {
  const res = await api.post(
    `/meetings/${meetingId}/action-items/${actionItemId}/convert`,
    payload
  );
  return res.data.task;
};

export default meetingService;