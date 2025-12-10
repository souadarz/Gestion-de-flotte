import express from "express";
import authRoutes from "./authRoute.js";
import chauffeurRoutes from "./chauffeurRoute.js"
import { authenticate, roleMiddleware } from "../middleware/auth.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", authenticate, roleMiddleware("admin"),chauffeurRoutes);

export default router;