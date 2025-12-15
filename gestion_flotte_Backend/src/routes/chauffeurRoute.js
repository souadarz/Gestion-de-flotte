import express from "express";
import { createChauffeur, getAllChauffeurs, getChauffeurById } from "../controllers/chauffeurController.js";

const router = express.Router();

router.post("/chauffeurs", createChauffeur);
router.get("/chauffeurs", getAllChauffeurs);
router.get("/chauffeurs/:id", getChauffeurById);

export default router;