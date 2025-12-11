import express from "express";
import authRoutes from "./authRoute.js";
import chauffeurRoutes from "./chauffeurRoute.js";
import camionRoutes from "./camionRoutes.js";
import remorqueRoutes from "./remorqueRoutes.js";
import trajetRoutes from "./trajetRoutes.js"
import { authenticate, roleMiddleware } from "../middleware/auth.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users",chauffeurRoutes);
router.use("/camions",camionRoutes);
router.use("/remorques", authenticate, roleMiddleware("admin"), remorqueRoutes);
router.use("/trajets", authenticate, trajetRoutes);

export default router;