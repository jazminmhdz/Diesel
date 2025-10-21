// src/models/Driver.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "El nombre del conductor es obligatorio"],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, "El número de licencia es obligatorio"],
      unique: true,
    },
    type: {
      type: String,
      enum: ["CRUCE", "LOCAL"],
      required: [true, "El tipo de chofer es obligatorio (CRUCE o LOCAL)"],
    },
    gafeteNumber: {
      type: String,
      default: "",
    },
    assignedTruck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
