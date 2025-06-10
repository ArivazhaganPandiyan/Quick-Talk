import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
            .select("-password -__v -createdAt -updatedAt") // Exclude sensitive and unnecessary fields
            .sort({ username: 1 }); // Sort alphabetically

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error in getUsersForSidebar:", error);
        res.status(500).json({ 
            error: "Internal Server Error",
            message: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};