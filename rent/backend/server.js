import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
// Configure CORS to allow requests from your frontend and to handle cookies
app.use(cors({
  origin: 'http://localhost:3000', // The address of your React frontend
  credentials: true, // This allows cookies to be sent
}));
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(express.urlencoded({ extended: true })); // Allows parsing of form data
app.use(cookieParser()); // Allows parsing of cookies

// API Routes
app.use('/api/auth', authRoutes);


// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
