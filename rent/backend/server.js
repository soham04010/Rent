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
const server = http.createServer(app); 

// --- ✅ FIXED CONFIGURATION STARTS HERE ---
const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';

// ✅ CORS setup (important for cookies to work across domains)
app.use(
  cors({
    origin: [clientURL, 'http://localhost:3000'], // Allow both production + local
    credentials: true, // Required to send cookies
  })
);

// ✅ Express + Cookie middleware (keep order)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Make sure cookies can be set securely
app.set('trust proxy', 1); // Required if deployed behind a proxy like Render or Vercel
// --- ✅ FIXED CONFIGURATION ENDS HERE ---

// --- PASS THE URL TO SOCKET.IO ---
initializeSocket(server, clientURL); // Pass the clientURL to the socket initializer

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
