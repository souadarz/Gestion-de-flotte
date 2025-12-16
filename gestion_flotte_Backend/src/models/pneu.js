import mongoose from "mongoose";

const PneuSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true },

    vehiculeType: {
      type: String,
      enum: ["camion", "remorque"],
      required: true,
    },

    vehiculeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "vehiculeType",
    },

    position: {
      type: String,
      enum: [
        "avant_gauche",
        "avant_droite",
        "arriere_gauche",
        "arriere_droite",
      ],
    },

    kmInstallation: { type: Number, required: true },
    kmActuel: { type: Number, required: true },
    kmMax: { type: Number, required: true },

    etat: {
      type: String,
      enum: ["bon", "usé", "à_remplacer"],
      default: "bon",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pneu", PneuSchema);
