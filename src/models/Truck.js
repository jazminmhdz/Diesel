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
      required: [true, "El número de serie es obligatorio"],
    },
    model: {
      type: String,
      required: [true, "El modelo es obligatorio"],
    },
    year: {
      type: Number,
      required: [true, "El año es obligatorio"],
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Truck", truckSchema);
