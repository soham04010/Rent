import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// --- Helper Function to Generate Token ---
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// --- Controller Functions ---

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({ _id: user._id, name: user.name, email: user.email });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
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
            res.status(200).json({ _id: user._id, name: user.name, email: user.email });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  // req.user is available because of the 'protect' middleware
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

        if (req.body.password) {
            user.password = req.body.password; // The pre-save hook will hash it
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
