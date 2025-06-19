import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();
router.route("/").get(verifyJWT, getUsers);

router.get("/", protectRoute, getUsersForSidebar);

export default router;
