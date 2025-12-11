import mongoose from "mongoose";

const TrajetSchema = new mongoose.Schema(
  {
    chauffeurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    camionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camion",
      required: true,
    },
    remorqueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Remorque",
      required: true,
    },
    lieuDepart: { type: String, required: true },
    lieuArrivee: { type: String, required: true },
    dateDepart: { type: String, required: true },
    dateArrivee: { type: String, required: true },
    kmDepart: { type: String },
    kmArrivee: {
      type: String,
      required: function () {
        return this.statut === "terminé";
      },
    },
    volumeGasoil: {
      type: Number,
      required: function () {
        return this.statut === "terminé";
      },
    },
    remarque: { type: String },
    statut: {
      type: String,
      enum: ["à_faire", "en_cours", "terminé"],
    //   default: "à_faire",
    },
  },
  { timestamps: true }
);

const Trajet = mongoose.model("Trajet", TrajetSchema);

export default Trajet;
