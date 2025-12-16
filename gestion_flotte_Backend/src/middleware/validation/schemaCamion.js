import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createCamionValidator = [
  body("immatriculation")
    .notEmpty().withMessage("Immatriculation requise")
    .isString(),

  body("marque").notEmpty().isString(),
  body("modele").notEmpty().isString(),

  body("annee")
    .notEmpty()
    .isInt({ min: 1900 })
    .withMessage("Année invalide"),

  body("kilometrageActuel")
    .notEmpty()
    .isInt({ min: 0 }),

  body("statut")
    .optional()
    .isIn(["disponible", "En service", "Maintenance"]),

  body("kmDerniereVidange")
    .notEmpty()
    .isInt({ min: 0 }),
];

export const updateCamionValidator = [
  param("id").custom(id => mongoose.Types.ObjectId.isValid(id)),

  body("immatriculation").optional().isString(),
  body("marque").optional().isString(),
  body("modele").optional().isString(),
  body("annee").optional().isInt({ min: 1900 }),
  body("kilometrageActuel").optional().isInt({ min: 0 }),
  body("statut").optional().isIn(["disponible", "En service", "Maintenance"]),
  body("kmDerniereVidange").optional().isInt({ min: 0 }),
];