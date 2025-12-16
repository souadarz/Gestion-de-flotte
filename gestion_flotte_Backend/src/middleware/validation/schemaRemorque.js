import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createRemorqueValidator = [
  body("immatriculation").notEmpty().isString(),
  body("type").notEmpty().isString(),
  body("statut")
    .optional()
    .isIn(["disponible", "en_service", "en_maintenance"]),
];

export const updateRemorqueValidator = [
  param("id").custom(id => mongoose.Types.ObjectId.isValid(id)),
  body("immatriculation").optional().isString(),
  body("type").optional().isString(),
  body("statut").optional().isIn(["disponible", "en_service", "en_maintenance"]),
];