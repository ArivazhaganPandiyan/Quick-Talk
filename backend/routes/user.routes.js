// backend/routes/user.routes.js
import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/user.controller.js"; // Correct import

const router = express.Router();
router.route("/")
  .get(
    verifyJWT, 
    rateLimiter({ windowMs: 15*60*1000, max: 100 }), // 100 requests/15min
    getUsersForSidebar
  );
// Protected route for sidebar users
router.get("/", verifyJWT, getUsersForSidebar); // Matches the controller function

export default router;