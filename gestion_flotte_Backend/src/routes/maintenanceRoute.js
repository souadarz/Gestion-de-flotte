import express from "express"
import { calculerProchaineMaintenance, createMaintenance, deleteMaintenance, getAllMaintenance, getMaintenanceById, updateMaintenance } from "../controllers/maintenanceController.js";

const router = express.Router();

router.post("/", createMaintenance);
router.get("/", getAllMaintenance);
router.get("/vehicule/:vehiculeId/prochaine",calculerProchaineMaintenance);
router.get("/:id", getMaintenanceById);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);

export default router;