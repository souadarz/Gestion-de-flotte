import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createRegleMaintenanceValidator = [
  body("type")
    .notEmpty()
    .isIn(["vidange", "pneus", "revision"]),

  body("periodiciteKm").optional().isInt({ min: 0 }),
  body("periodiciteMois").optional().isInt({ min: 0 }),
  body("description").optional().isString(),

  body("seuilAlerteKm")
    .if(body("type").isIn(["vidange", "pneus"]))
    .notEmpty()
    .isInt({ min: 0 }),

  body("seuilAlerteJours")
    .if(body("type").equals("revision"))
    .notEmpty()
    .isInt({ min: 0 }),
];

export const updateRegleMaintenanceValidator = [
  param("id").custom(id => mongoose.Types.ObjectId.isValid(id)),

  body("type").optional().isIn(["vidange", "pneus", "revision"]),
  body("periodiciteKm").optional().isInt({ min: 0 }),
  body("periodiciteMois").optional().isInt({ min: 0 }),
  body("description").optional().isString(),
  body("seuilAlerteKm").optional().isInt({ min: 0 }),
  body("seuilAlerteJours").optional().isInt({ min: 0 }),
];