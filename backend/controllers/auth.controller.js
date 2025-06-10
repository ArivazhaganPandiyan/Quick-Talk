import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {generateTokenAndSetCookie} from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        // Validate input
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: "Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate profile picture
        const profilePic = gender === "male" 
            ? `https://avatar.iran.liara.run/public/boy?username=${username}`
            : `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // Create new user
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic,
        });

        if (!newUser) {
            return res.status(400).json({ error: "Invalid user data" });
        }

        // Save user and generate token
        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);

        // Return response without sensitive data
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
            gender: newUser.gender,
        });

    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ 
            error: "Internal Server Error",
            message: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
            gender: user.gender,
        });

    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ 
            error: "Internal Server Error",
            message: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error);
        res.status(500).json({ 
            error: "Internal Server Error",
            message: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};