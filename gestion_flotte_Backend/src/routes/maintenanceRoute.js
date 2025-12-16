import express from "express"
import { calculerProchaineMaintenance, createMaintenance, deleteMaintenance, getAllMaintenance, getMaintenanceById, updateMaintenance } from "../controllers/maintenanceController.js";
import { validate } from "../middleware/validation/validate.js";
import { createMaintenanceValidator, updateMaintenanceValidator} from "../middleware/validation/schemaMaintenance.js";

const router = express.Router();

router.post("/", createMaintenanceValidator, validate, createMaintenance);
router.get("/", getAllMaintenance);
router.get("/vehicule/:vehiculeId/prochaine",calculerProchaineMaintenance);
router.get("/:id", getMaintenanceById);
router.put("/:id", updateMaintenance);
router.delete("/:id", updateMaintenanceValidator, validate, deleteMaintenance);

export default router;