import express from "express"
import { createCamion, deleteCamion, getAllCamions, getCamionById, updateCamion } from "../controllers/camionController.js";

const router = express.Router();

router.post("/", createCamion);
router.get("/", getAllCamions);
router.get("/:id", getCamionById);
router.put("/:id", updateCamion);
router.delete("/:id", deleteCamion);

export default router;