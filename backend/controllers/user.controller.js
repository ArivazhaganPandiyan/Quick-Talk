// backend/controllers/user.controller.js
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // More robust query with additional filtering
        const filteredUsers = await User.find({ 
            _id: { $ne: loggedInUserId },
            isActive: true // Example additional filter
        })
        .select("-password -refreshToken -__v -createdAt -updatedAt")
        .sort({ username: 1 })
        .lean(); // Convert to plain JS objects for better performance

        // Format response consistently
        res.status(200).json({
            success: true,
            data: filteredUsers,
            count: filteredUsers.length
        });

    } catch (error) {
        console.error("Error in getUsersForSidebar:", error);
        
        // Consistent error response format
        res.status(500).json({ 
            success: false,
            error: "Internal Server Error",
            message: process.env.NODE_ENV === "development" ? error.message : undefined,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined
        });
    }
};