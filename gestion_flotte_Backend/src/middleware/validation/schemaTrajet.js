import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createTrajetValidator = [
  body("chauffeurId").notEmpty().custom(id => mongoose.Types.ObjectId.isValid(id)),
  body("camionId").notEmpty().custom(id => mongoose.Types.ObjectId.isValid(id)),
  body("remorqueId").notEmpty().custom(id => mongoose.Types.ObjectId.isValid(id)),

  body("lieuDepart").notEmpty().isString(),
  body("lieuArrivee").notEmpty().isString(),

  body("dateDepart").notEmpty().isISO8601(),
  body("dateArrivee").notEmpty().isISO8601(),

  body("statut").optional().isIn(["à faire", "en_cours", "terminé"]),

  body("kmArrivee")
    .if(body("statut").equals("terminé"))
    .notEmpty(),

  body("volumeGasoil")
    .if(body("statut").equals("terminé"))
    .notEmpty()
    .isFloat({ min: 0 }),

  body("remarque").optional().isString(),
];

export const updateTrajetValidator = [
  param("id").custom(id => mongoose.Types.ObjectId.isValid(id)),
  body().optional(),
];