import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// --- Helper Function to Generate Token ---
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

  // ✅ FIXED COOKIE CONFIG (cross-site compatible)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // true in production
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax', // allow cross-origin cookies
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// --- Controller Functions ---

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signupUser = async (req, res) => {
  const { name, email, password, role } = req.body; // Capture 'role' from frontend
  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please enter all fields, including a role.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'An account with this email already exists.' });

    const user = await User.create({ name, email, password, role });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      // Return the user's role so the frontend knows who is logged in
      res
        .status(200)
        .json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      address: updatedUser.address,
      phone: updatedUser.phone,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
