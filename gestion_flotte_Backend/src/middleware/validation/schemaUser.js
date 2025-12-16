import { body, param } from "express-validator";
import mongoose from "mongoose";

export const createUserValidator = [
  body("nom").notEmpty().isString(),

  body("email")
    .notEmpty()
    .isEmail(),

  body("motDePasse")
    .notEmpty()
    .isLength({ min: 6 }),

  body("role")
    .optional()
    .isIn(["admin", "chauffeur"]),
];

export const updateUserValidator = [
  param("id").custom(id => mongoose.Types.ObjectId.isValid(id)),
  body("nom").optional().isString(),
  body("email").optional().isEmail(),
  body("motDePasse").optional().isLength({ min: 6 }),
  body("role").optional().isIn(["admin", "chauffeur"]),
];