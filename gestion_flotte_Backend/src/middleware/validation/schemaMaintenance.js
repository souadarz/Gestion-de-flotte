import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createMaintenanceValidator = [
  body("vehiculeType")
    .notEmpty()
    .isIn(["camion", "remorque"]),

  body("vehiculeModel")
    .notEmpty()
    .isIn(["Camion", "Remorque"]),

  body("vehiculeId")
    .notEmpty()
    .custom(id => mongoose.Types.ObjectId.isValid(id)),

  body("regleMaintenanceId")
    .notEmpty()
    .custom(id => mongoose.Types.ObjectId.isValid(id)),

  body("type")
    .notEmpty()
    .isIn(["vidange", "pneus", "revision"]),

  body("dateMaintenance")
    .notEmpty()
    .isISO8601(),

  body("kilometrageRealisation")
    .notEmpty()
    .isInt({ min: 0 }),

  body("cout").optional().isFloat({ min: 0 }),
  body("description").optional().isString(),
];

export const updateMaintenanceValidator = [
  param("id").custom(id => mongoose.Types.ObjectId.isValid(id)),

  body("vehiculeType").optional().isIn(["camion", "remorque"]),
  body("vehiculeModel").optional().isIn(["Camion", "Remorque"]),
  body("vehiculeId").optional().custom(id => mongoose.Types.ObjectId.isValid(id)),
  body("regleMaintenanceId").optional().custom(id => mongoose.Types.ObjectId.isValid(id)),
  body("type").optional().isIn(["vidange", "pneus", "revision"]),
  body("dateMaintenance").optional().isISO8601(),
  body("kilometrageRealisation").optional().isInt({ min: 0 }),
  body("cout").optional().isFloat({ min: 0 }),
  body("description").optional().isString(),
];