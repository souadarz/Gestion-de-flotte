import express from "express";
import { createChauffeur, getAllChauffeurs, getChauffeurById } from "../controllers/chauffeurController.js";

const router = express.Router();

router.post("/chauffeur", createChauffeur);
router.get("/chauffeur", getAllChauffeurs);
router.get("/chauffeur/:id", getChauffeurById);

export default router;