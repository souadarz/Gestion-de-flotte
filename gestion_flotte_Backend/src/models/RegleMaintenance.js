import mongoose from "mongoose";

const RegleMaintenanceShema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["vidange", "pneus", "revision"],
      required: true,
    },
    periodiciteKm: { type: Number, min: 0 }, // ex: vidange tous les 10 000 km
    periodiciteMois: { type: Number, min: 0 }, // ex: révision tous les 6 mois
    description: { type: String },
    seuilAlerteKm: {
      type: Number,
      required: function () {
        return this.type === "vidange" || this.type === "pneus";
      },
    },

    seuilAlerteJours: { type: Number, required: function(){
        return this.type === "revision"
    }}, //alerte 7 jours avant la date prévue
  },
  { timestamps: true }
);

const RegleMaintenance = mongoose.model(
  "RegleMaintenance",
  RegleMaintenanceShema
);

export default RegleMaintenance;
