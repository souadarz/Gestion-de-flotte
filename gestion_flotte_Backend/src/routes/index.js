import express from "express";
import authRoutes from "./authRoute.js";
import chauffeurRoutes from "./chauffeurRoute.js"
import camionRoutes from "./camionRoutes.js"
import { authenticate, roleMiddleware } from "../middleware/auth.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", authenticate, roleMiddleware("admin"),chauffeurRoutes);
router.use("/camions", authenticate, roleMiddleware("admin"), camionRoutes);

export default router;