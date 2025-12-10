import express from "express";
import { createChauffeur } from "../controllers/chauffeurController.js";

const router = express.Router();

router.post("/chauffeur", createChauffeur);

export default router;