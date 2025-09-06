import express from 'express';
const router = express.Router();
import {
  loginUser,
  signupUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

// Public routes
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes (user must be logged in)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
