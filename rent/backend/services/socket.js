import { Server } from 'socket.io';
import Message from '../models/messageModel.js';

export function initializeSocket(server, clientURL) {
  const io = new Server(server, {
    cors: {
      origin: clientURL, // Use the clientURL variable here
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // User joins a room specific to a booking
    socket.on('join_chat', (bookingId) => {
      socket.join(bookingId);
      console.log(`User ${socket.id} joined chat room: ${bookingId}`);
    });

    // --- THIS IS THE MISSING LOGIC ---
    // Listen for a new message from a client
    socket.on('send_message', async (data) => {
      try {
        const { booking, sender, receiver, content } = data;
        
        // 1. Create and save the message to the database
        const newMessage = new Message({ booking, sender, receiver, content });
        await newMessage.save();
        
        // 2. Populate the sender's info (name, avatar) for the chat UI
        const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name avatar');

        // 3. Broadcast the new (populated) message to everyone in the room
        io.to(booking).emit('receive_message', populatedMessage);

      } catch (error) {
        console.error('Error handling message:', error);
      }
    });
    // --- END OF MISSING LOGIC ---

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}