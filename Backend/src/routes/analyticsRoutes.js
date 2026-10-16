import express from 'express';
import { getPlatformAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getPlatformAnalytics);

export default router;
