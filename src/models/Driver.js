// models/Driver.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    gafeteNumber: {
      type: String,
      default: null,
      trim: true,
    },

    type: {
      type: String,
      enum: ["CRUCE", "LOCAL"],
      required: true,
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
