// src/models/Truck.js
import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    economicNumber: { type: String, required: true, unique: true, trim: true },
    vin: { type: String, required: true, unique: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1995, max: 2100 },
    expectedMpgMin: { type: Number, default: 4 },
    expectedMpgMax: { type: Number, default: 10 },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Truck", truckSchema);
