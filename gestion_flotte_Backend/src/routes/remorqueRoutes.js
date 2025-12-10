import express from "express"
import { createRemorque, deleteRemorque, getAllRemorques, getRemorqueById, updateRemorque } from "../controllers/remorqueController.js";

const router = express.Router();

router.post("/", createRemorque);
router.get("/", getAllRemorques);
router.get("/:id", getRemorqueById);
router.put("/:id", updateRemorque);
router.delete("/:id", deleteRemorque);

export default router;