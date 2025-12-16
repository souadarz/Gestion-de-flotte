import express from "express"
import { createRemorque, deleteRemorque, getAllRemorques, getRemorqueById, updateRemorque } from "../controllers/remorqueController.js";
import { validate } from "../middleware/validation/validate.js";
import { createRemorqueValidator, updateRemorqueValidator } from "../middleware/validation/schemaRemorque.js";

const router = express.Router();

router.post("/", createRemorqueValidator, validate, createRemorque);
router.get("/", getAllRemorques);
router.get("/:id", getRemorqueById);
router.put("/:id", updateRemorqueValidator, validate, updateRemorque);
router.delete("/:id", deleteRemorque);

export default router;