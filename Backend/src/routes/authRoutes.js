import express from 'express';
import { register, login, getMe, updateProfile, uploadAvatar, getAllUsers } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/users', protect, getAllUsers);

export default router;
