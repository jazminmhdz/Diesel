// src/models/Truck.js
import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    economicNumber: {
      type: String,
      required: [true, "El número económico es obligatorio"],
      unique: true,
    },
    vin: {
      type: String,
      required: [true, "El VIN es obligatorio"],
      unique: true,
    },
    brand: {
      type: String,
      required: [true, "La marca es obligatoria"],
    },
    year: {
      type: Number,
      required: [true, "El año del camión es obligatorio"],
    },
    platesMx: {
      type: String,
      required: [true, "Las placas son obligatorias"],
    },
    platesUsa: {
      type: String,
      default: "",
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    image: {
      type: String,
      default: "", // URL de la imagen del camión (si se sube)
    },
  },
  { timestamps: true }
);

export default mongoose.model("Truck", truckSchema);
