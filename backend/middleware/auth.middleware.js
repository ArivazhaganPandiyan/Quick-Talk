// backend/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        if (!req.user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});