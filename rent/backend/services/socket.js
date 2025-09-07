import { Server } from 'socket.io';
import Message from '../models/messageModel.js';

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Your frontend URL
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

    // Listen for a new message from a client
    socket.on('send_message', async (data) => {
      const { booking, sender, receiver, content } = data;
      
      // 1. Save the message to the database
      const newMessage = new Message({ booking, sender, receiver, content });
      await newMessage.save();
      const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name avatar');

      // 2. Broadcast the new message to everyone in that specific booking room
      io.to(booking).emit('receive_message', populatedMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}
