import express from "express";
import authRoutes from "./authRoute.js";
import chauffeurRoutes from "./chauffeurRoute.js";
import camionRoutes from "./camionRoutes.js";
import remorqueRoutes from "./remorqueRoutes.js";
import trajetRoutes from "./trajetRoutes.js";
import maintenanceRoutes from "./maintenanceRoute.js";
import regleMaintenanceRoutes from "./regleMaintenanceRoute.js";
import { authenticate, roleMiddleware } from "../middleware/auth.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", authenticate, roleMiddleware("admin"),chauffeurRoutes);
router.use("/camions", authenticate, roleMiddleware("admin"), camionRoutes);
router.use("/remorques", authenticate, roleMiddleware("admin"), remorqueRoutes);
router.use("/trajets", authenticate, trajetRoutes);
router.use("/maintenance", authenticate, roleMiddleware("admin"),  maintenanceRoutes);
router.use("/regle-maintenance", authenticate, roleMiddleware("admin"), regleMaintenanceRoutes);

export default router;