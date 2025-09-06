import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  // This field is the differentiator
  role: {
    type: String,
    enum: ['user', 'seller'], // The role must be one of these two values
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://placehold.co/200x200/EFEFEF/AAAAAA&text=Avatar', // A default placeholder
  }
}, { timestamps: true });

// --- Mongoose Middleware (hashes password before saving) ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Mongoose Methods (compares passwords for login) ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

