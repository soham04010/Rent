import Booking from '../models/bookingModel.js';
import Product from '../models/productModel.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/User
export const createBooking = async (req, res) => {
  const { productId, startDate, endDate, totalPrice } = req.body;
  
  try {
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const booking = await Booking.create({
      product: productId,
      customer: req.user._id,
      seller: product.owner,
      startDate,
      endDate,
      totalPrice,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get bookings for the logged-in customer
// @route   GET /api/bookings/my-bookings
// @access  Private/User
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('product', 'name imageUrl')
      .populate('seller', 'name _id'); 
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get booking requests for the logged-in seller
// @route   GET /api/bookings/seller
// @access  Private/Seller
export const getSellerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ seller: req.user._id })
            .populate('product', 'name')
            .populate('customer', 'name email _id');
        res.json(bookings);
    } catch(error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Seller
export const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    try {
        // --- DEBUGGING CHECKPOINT 1 ---
        console.log(`Attempting to update booking ${req.params.id} to status: ${status}`);

        const booking = await Booking.findById(req.params.id);

        if (booking) {
            if (booking.seller.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: "Not authorized" });
            }
            booking.status = status;

            // --- DEBUGGING CHECKPOINT 2 ---
            console.log(`Booking found. Product ID to update: ${booking.product}`);

            if (status === 'approved') {
                await Product.findByIdAndUpdate(booking.product, { isAvailable: false });
                // --- DEBUGGING CHECKPOINT 3 ---
                console.log(`Product ${booking.product} has been marked as UNAVAILABLE.`);
            } 
            else if (status === 'declined' || status === 'completed') {
                await Product.findByIdAndUpdate(booking.product, { isAvailable: true });
                // --- DEBUGGING CHECKPOINT 3 ---
                console.log(`Product ${booking.product} has been marked as AVAILABLE.`);
            }

            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

