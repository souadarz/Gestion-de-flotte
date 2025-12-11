import mongoose from "mongoose";

const RemorqueSchema = new mongoose.Schema({
    immatriculation: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    statut: {
      type: String,
      required: true,
      enum: ["disponible", "en_service", "en_maintenance"],
      default: "disponible",
    },
  },
  { timestamps: true });

const Remorque = mongoose.model("Remorque", RemorqueSchema);

export default Remorque;