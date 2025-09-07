import express from 'express';
const router = express.Router();
import { getMessageHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

// This line creates the GET /api/chat/:bookingId endpoint
router.get('/:bookingId', protect, getMessageHistory);

export default router;

