import express from "express"
import { createTrajet, deleteTrajet, getAllTrajets, getTrajetById, getTrajetsChauffeur, updateTrajetChauffeur } from "../controllers/trajetController.js";
import { roleMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", roleMiddleware("admin"), createTrajet);
router.get("/", roleMiddleware("admin"), getAllTrajets);
router.get("/chauffeur", getTrajetsChauffeur);
router.get("/:id", getTrajetById);
router.put("/:id", roleMiddleware("chauffeur"),updateTrajetChauffeur);
router.delete("/:id",roleMiddleware("admin"), deleteTrajet);

export default router;