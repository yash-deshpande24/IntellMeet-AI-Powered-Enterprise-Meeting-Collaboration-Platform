import express from 'express';
import { 
  createMeeting, 
  getMeetings, 
  getMeetingByCode, 
  getMeetingById, 
  updateMeetingStatus, 
  triggerAiSummary, 
  saveTranscriptItem,
  convertActionItemToTask
} from '../controllers/meetingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createMeeting)
  .get(protect, getMeetings);

router.get('/code/:code', protect, getMeetingByCode);
router.get('/:id', protect, getMeetingById);
router.patch('/:id/status', protect, updateMeetingStatus);
router.post('/:id/ai-summary', protect, triggerAiSummary);
router.post('/:id/transcript', protect, saveTranscriptItem);
router.post('/:meetingId/action-items/:actionItemId/convert', protect, convertActionItemToTask);

export default router;
