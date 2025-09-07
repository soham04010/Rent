import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrls: {
      type: [String],
      required: true,
      default: [],
    },
    location: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

