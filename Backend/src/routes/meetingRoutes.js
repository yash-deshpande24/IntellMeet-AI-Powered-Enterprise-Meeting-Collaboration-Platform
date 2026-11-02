import express from 'express';
import { 
  createMeeting, 
  getMeetings, 
  getMeetingByCode, 
  verifyMeetingPasscode,
  getMeetingById, 
  updateMeetingStatus, 
  triggerAiSummary, 
  saveTranscriptItem,
  convertActionItemToTask
} from '../controllers/meetingController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createMeeting)
  .get(protect, getMeetings);

router.get('/code/:code', optionalAuth, getMeetingByCode);
router.post('/code/:code/verify-passcode', optionalAuth, verifyMeetingPasscode);
router.get('/:id', protect, getMeetingById);
router.patch('/:id/status', protect, updateMeetingStatus);
router.post('/:id/ai-summary', protect, triggerAiSummary);
router.post('/:id/transcript', protect, saveTranscriptItem);
router.post('/:meetingId/action-items/:actionItemId/convert', protect, convertActionItemToTask);

export default router;
