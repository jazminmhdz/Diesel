import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del conductor es obligatorio"],
      trim: true,
    },
    numLicencia: {
      type: String,
      required: [true, "El número de licencia es obligatorio"],
      unique: true,
    },

    // 🔥 Gafete OPCIONAL  
    numGafete: {
      type: String,
      required: false,        // <--- YA NO ES OBLIGATORIO
      unique: false,          // <--- Opcional, así no marca error si se repite
      default: null,
    },

    tipo: {
      type: String,
      enum: ["CRUCE", "LOCAL"],
      required: [true, "El tipo del chofer es obligatorio"],
    },

    truckAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
