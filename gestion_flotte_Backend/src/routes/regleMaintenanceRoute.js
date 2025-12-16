import express from "express"
import { createRegleMaintenance, deleteRegleMaintenance, getAllRegleMaintenance, getRegleMaintenanceById, updateRegleMaintenance } from "../controllers/regleMaintenanceController.js";
import { validate } from "../middleware/validation/validate.js";
import { createRegleMaintenanceValidator, updateRegleMaintenanceValidator } from "../middleware/validation/schemasRegleMaintenance..js";

const router = express.Router();

router.post("/", createRegleMaintenanceValidator, validate, createRegleMaintenance);
router.get("/", getAllRegleMaintenance);
router.get("/:id", getRegleMaintenanceById);
router.put("/:id", updateRegleMaintenanceValidator, validate, updateRegleMaintenance);
router.delete("/:id", deleteRegleMaintenance);

export default router;