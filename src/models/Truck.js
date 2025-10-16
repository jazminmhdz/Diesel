import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    economicNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    vin: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    expectedMpgMin: {
      type: Number,
      default: 5,
    },
    expectedMpgMax: {
      type: Number,
      default: 10,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Truck", truckSchema);
