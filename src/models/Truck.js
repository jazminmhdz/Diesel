// src/models/Truck.js
import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    // soportamos varios nombres para evitar incompatibilidades entre frontend/backend
    serialNumber: { type: String, trim: true, default: "" }, // número de serie (opcional si usas vin)
    economicNumber: { type: String, required: true, unique: true, trim: true }, // número económico
    vin: { type: String, required: true, unique: true, trim: true }, // VIN
    brand: { type: String, required: true }, // marca / modelo?
    model: { type: String, required: true }, // modelo
    year: { type: Number, required: true }, // año
    platesMx: { type: String, required: false, trim: true, default: "" },
    platesUsa: { type: String, default: null, trim: true },
    // campo para relación a chofer si luego lo necesitas
    driverAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null },
    imageUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Truck", truckSchema);
