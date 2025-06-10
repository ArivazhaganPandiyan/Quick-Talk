import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

// Database and Socket
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

// Initialize environment variables
dotenv.config();

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // Parse JSON payloads
app.use(cookieParser()); // Parse cookies

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ===== REMOVED FRONTEND SERVING =====
// (Render should only serve backend API)
// ====================================

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});

// Server startup
const startServer = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await connectToMongoDB();
        
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    server.close(() => process.exit(1));
});