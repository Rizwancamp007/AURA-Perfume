import { Server } from 'socket.io';

let io;

export const initOrderSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket Connected: ${socket.id}`);

    // Join order tracking room
    socket.on('joinOrderRoom', (orderId) => {
      socket.join(orderId);
      console.log(`📦 Socket ${socket.id} joined tracking room: ${orderId}`);
    });

    // Leave order tracking room
    socket.on('leaveOrderRoom', (orderId) => {
      socket.leave(orderId);
      console.log(`🚪 Socket ${socket.id} left tracking room: ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Helper to broadcast status changes
export const emitOrderStatusUpdate = (orderId, orderData) => {
  if (io) {
    io.to(orderId).emit('orderStatusUpdated', orderData);
    console.log(`📡 Broadcasted status update to tracking room: ${orderId}`);
  } else {
    console.warn('⚠️ Socket.io is not initialized. Cannot broadcast status update.');
  }
};
