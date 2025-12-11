import mongoose from "mongoose";

const CamionSchema = new mongoose.Schema(
  {
    immatriculation: { type: String, required: true, unique: true },
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    annee: { type: Number, required: true },
    kilometrageActuel: { type: Number, required: true },
    statut: {
      type: String,
      required: true,
      enum: ["disponible", "en_service", "en_maintenance"],
      default: "disponible",
    },
    kmDerniereVidange: { type: Number, required: true },
  },
  { timestamps: true }
);

const Camion = mongoose.model("Camion", CamionSchema);

export default Camion;