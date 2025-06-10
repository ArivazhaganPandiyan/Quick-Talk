import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with enhanced security
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "development" 
      ? "http://localhost:3000" 
      : process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization"],
  },
  connectionStateRecovery: {
    // Enable reconnection with state recovery
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
  pingInterval: 10000, // 10 seconds
  pingTimeout: 5000,   // 5 seconds
});

// Track active connections
const userSocketMap = {}; // { userId: socketId }
const socketUserMap = {}; // { socketId: userId } for reverse lookup

// Get receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Get all online users
export const getOnlineUsers = () => {
  return Object.keys(userSocketMap);
};

// Connection handler
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Extract user ID from handshake query
  const userId = socket.handshake.query.userId;
  
  // Validate and store user connection
  if (userId && userId !== "undefined") {
    // Disconnect previous connection if user already connected
    if (userSocketMap[userId]) {
      const oldSocketId = userSocketMap[userId];
      io.to(oldSocketId).emit("forceDisconnect", "New connection detected");
      io.sockets.sockets.get(oldSocketId)?.disconnect();
    }

    // Store new connection
    userSocketMap[userId] = socket.id;
    socketUserMap[socket.id] = userId;

    // Notify all clients about updated online users
    io.emit("onlineUsers", getOnlineUsers());
    
    console.log(`User ${userId} connected with socket ${socket.id}`);
  }

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
    const disconnectedUserId = socketUserMap[socket.id];
    
    if (disconnectedUserId) {
      delete userSocketMap[disconnectedUserId];
      delete socketUserMap[socket.id];
      io.emit("onlineUsers", getOnlineUsers());
      console.log(`User ${disconnectedUserId} disconnected`);
    }
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error(`Socket error (${socket.id}):`, error);
  });

  // Optional: Add ping-pong for connection health monitoring
  socket.on("ping", (cb) => {
    if (typeof cb === "function") {
      cb("pong");
    }
  });
});

// Handle server errors
server.on("error", (error) => {
  console.error("Server error:", error);
});

export { app, io, server };