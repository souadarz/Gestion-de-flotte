import express from "express";
import { createChauffeur, getAllChauffeurs, getChauffeurById } from "../controllers/chauffeurController.js";
import { validate } from "../middleware/validation/validate.js";
import { createUserValidator } from "../middleware/validation/schemaUser.js";

const router = express.Router();

router.post("/chauffeurs", createUserValidator, validate, createChauffeur);
router.get("/chauffeurs", getAllChauffeurs);
router.get("/chauffeurs/:id", getChauffeurById);

export default router;