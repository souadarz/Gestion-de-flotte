import express from "express"
import { createTrajet, deleteTrajet, getAllTrajets, getTrajetById, getTrajetsChauffeur, updatetrajet, updateTrajetChauffeur } from "../controllers/trajetController.js";
import { roleMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", roleMiddleware("admin"), createTrajet);
router.get("/", roleMiddleware("admin"), getAllTrajets);
router.get("/chauffeur", getTrajetsChauffeur);
router.get("/:id", getTrajetById);
router.put("/:id/chauffeur", roleMiddleware("chauffeur"),updateTrajetChauffeur);
router.put("/:id", roleMiddleware("admin"),updatetrajet);
router.delete("/:id",roleMiddleware("admin"), deleteTrajet);

export default router;