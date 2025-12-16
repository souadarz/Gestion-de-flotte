import express from "express"
import { createRegleMaintenance, deleteRegleMaintenance, getAllRegleMaintenance, getRegleMaintenanceById } from "../controllers/regleMaintenanceController.js";

const router = express.Router();

router.post("/", createRegleMaintenance);
router.get("/", getAllRegleMaintenance);
router.get("/:id", getRegleMaintenanceById);
// router.put("/:id", updateRegleMaintenance);
router.delete("/:id", deleteRegleMaintenance);

export default router;