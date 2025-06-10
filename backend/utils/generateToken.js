import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

// Load environment variables
dotenv.config();

/**
 * Generates a JWT token and sets it as an HTTP-only cookie
 * @param {string} userId - The user ID to include in the token payload
 * @param {object} res - Express response object
 * @param {string} [tokenType="access"] - Type of token (access/refresh)
 * @returns {string} The generated JWT token
 */
export const generateTokenAndSetCookie = (userId, res, tokenType = "access") => {
    if (!userId || !res) {
        throw new Error("UserId and response object are required");
    }

    const expiresIn = tokenType === "refresh" ? "30d" : "15d";
    const maxAge = tokenType === "refresh" 
        ? 30 * 24 * 60 * 60 * 1000 
        : 15 * 24 * 60 * 60 * 1000;

    const token = jwt.sign(
        { 
            userId,
            type: tokenType,
            iss: process.env.JWT_ISSUER || "your-app-name",
            aud: process.env.JWT_AUDIENCE || "your-app-client"
        },
        process.env.JWT_SECRET,
        {
            expiresIn,
            algorithm: "HS256",
            jwtid: crypto.randomBytes(16).toString("hex"),
        }
    );

    const cookieName = tokenType === "refresh" ? "refreshToken" : "jwt";
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie(cookieName, token, {
        maxAge,
        httpOnly: true,
        sameSite: isProduction ? "strict" : "lax",
        secure: isProduction,
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
        path: tokenType === "refresh" ? "/api/auth/refresh" : "/",
        priority: "high",
    });

    return token;
};

/**
 * Clears the JWT cookie
 * @param {object} res - Express response object
 * @param {string} [tokenType="access"] - Type of token to clear
 */
export const clearTokenCookie = (res, tokenType = "access") => {
    const cookieName = tokenType === "refresh" ? "refreshToken" : "jwt";
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie(cookieName, {
        httpOnly: true,
        sameSite: isProduction ? "strict" : "lax",
        secure: isProduction,
        domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
        path: tokenType === "refresh" ? "/api/auth/refresh" : "/",
    });
};
