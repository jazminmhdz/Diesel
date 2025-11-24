// models/Truck.js
import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    economico: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    vin: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    marca: {
      type: String,
      required: true,
    },
    anio: {
      type: Number,
      required: true,
    },
    platesMx: {
      type: String,
      required: true,
      trim: true,
    },
    platesUsa: {
      type: String,
      default: null,
      trim: true,
    },
    driverAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Truck", truckSchema);
