import express from "express"
import { createTrajet, deleteTrajet, getAllTrajets, getTrajetById, getTrajetsChauffeur, updatetrajet, updateTrajetChauffeur } from "../controllers/trajetController.js";
import { roleMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validation/validate.js";
import { createTrajetValidator, updateTrajetValidator } from "../middleware/validation/schemaTrajet.js";

const router = express.Router();

router.post("/", roleMiddleware("admin"), createTrajetValidator, validate, createTrajet);
router.get("/", roleMiddleware("admin"), getAllTrajets);
router.get("/chauffeur", getTrajetsChauffeur);
router.get("/:id", getTrajetById);
router.put("/chauffeur/:id", roleMiddleware("chauffeur"),updateTrajetChauffeur);
router.put("/:id", roleMiddleware("admin"), updateTrajetValidator, validate, updatetrajet);
router.delete("/:id",roleMiddleware("admin"), deleteTrajet);

export default router;