import express from "express";
import { getUserConnected, login, logout } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get("/me",  authenticate, getUserConnected);

export default router