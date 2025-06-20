// backend/controllers/user.controller.js
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        // Verify user exists in request
        if (!req.user?._id) {
            return res.status(401).json({ error: "Unauthorized - No user token" });
        }

        const filteredUsers = await User.find({ 
            _id: { $ne: req.user._id }
        }).select("-password -refreshToken -__v")
          .lean();

        if (!filteredUsers) {
            return res.status(404).json({ error: "No users found" });
        }

        return res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("User fetch error:", error);
        return res.status(500).json({ 
            error: "Server Error",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};