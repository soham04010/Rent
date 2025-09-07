import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'declined', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
