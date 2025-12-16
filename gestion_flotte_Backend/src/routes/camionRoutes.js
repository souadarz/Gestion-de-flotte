import express from "express"
import { createCamion, deleteCamion, getAllCamions, getCamionById, updateCamion } from "../controllers/camionController.js";
import { validate } from "../middleware/validation/validate.js";
import { createCamionValidator, updateCamionValidator } from "../middleware/validation/schemaCamion.js";

const router = express.Router();

router.post("/", createCamionValidator ,validate, createCamion);
router.get("/", getAllCamions);
router.get("/:id", getCamionById);
router.put("/:id", updateCamionValidator, validate, updateCamion);
router.delete("/:id", deleteCamion);

export default router;