import express from 'express';
import http from 'http'; // Import the node 'http' module
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import chatRoutes from './routes/chatRoutes.js'; // Make sure this is imported
import { initializeSocket } from './services/socket.js'; 

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
// --- ADDITION: Create an HTTP server from the Express app for Socket.IO ---
const server = http.createServer(app); 

// --- ADDITION: Initialize and attach Socket.IO to the HTTP server ---
initializeSocket(server);

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
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes); // ADDITION: Use the chat routes

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

// --- CHANGE: Start the server using the http instance, not the express app ---
server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

