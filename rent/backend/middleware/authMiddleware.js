import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach the user object to the request, but exclude the password
      req.user = await User.findById(decoded.userId).select('-password');
      next(); // Move to the next function
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
