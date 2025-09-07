import express from 'express';
const router = express.Router();
import {
  createBooking,
  getMyBookings,
  getSellerBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/seller', protect, getSellerBookings);
router.put('/:id/status', protect, updateBookingStatus);

export default router;
