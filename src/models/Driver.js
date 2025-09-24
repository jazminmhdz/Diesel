// src/models/Driver.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, trim: true },
    badge: { type: String, trim: true }, // número de gafete
    assignedTruck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck", default: null },
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // login asociado
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
