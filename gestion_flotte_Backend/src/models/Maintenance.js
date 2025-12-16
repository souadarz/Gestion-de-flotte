import mongoose from "mongoose";

const MaintenanceSchema = new mongoose.Schema(
  {
    vehiculeType: {
      type: String,
      enum: ["camion", "remorque"],
      required: true,
    },

    vehiculeModel: {
      type: String,
      enum: ["Camion", "Remorque"],
      required: true,
    },

    vehiculeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "vehiculeModel",
    },

    regleMaintenanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegleMaintenance",
      required: true,
    },
    type: {
      type: String,
      enum: ["vidange", "pneus", "revision"],
      required: true,
    },
    dateMaintenance: { type: Date, required: true },
    kilometrageRealisation: { type: Number, required: true },
    cout: { type: Number },
    description: { type: String },
  },
  { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", MaintenanceSchema);

export default Maintenance;
