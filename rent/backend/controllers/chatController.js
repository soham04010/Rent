import Message from '../models/messageModel.js';
import Booking from '../models/bookingModel.js';

// @desc    Get message history for a booking
// @route   GET /api/chat/:bookingId
// @access  Private
export const getMessageHistory = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    
    // Security check: Make sure the person requesting is part of the conversation
    if (req.user._id.toString() !== booking.customer.toString() && req.user._id.toString() !== booking.seller.toString()) {
      return res.status(403).json({ message: "Not authorized to view this chat." });
    }

    const messages = await Message.find({ booking: bookingId }).populate('sender', 'name avatar');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

