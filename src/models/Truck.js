// models/Truck.js
import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    economicNumber: {       // Número económico
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    vin: {                  // VIN
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    brand: {                // Marca
      type: String,
      required: true,
    },
    year: {                 // Año
      type: Number,
      required: true,
    },
    platesMx: {             // Placas mexicanas
      type: String,
      required: true,
      trim: true,
    },
    platesUsa: {            // Placas USA (opcional)
      type: String,
      default: null,
      trim: true,
    },
    driver: {               // Chofer asignado (opcional)
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    image: {                // FOTO opcional
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Truck", truckSchema);
