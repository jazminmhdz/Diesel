import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    numeroSerie: {
      type: String,
      required: [true, "El número de serie es obligatorio"],
      unique: true,
    },
    economico: {
      type: String,
      required: [true, "El número económico es obligatorio"],
      unique: true,
    },
    marca: {
      type: String,
      required: [true, "La marca es obligatoria"],
    },
    modelo: {
      type: String,
      required: [true, "El modelo es obligatorio"],
    },
    anio: {
      type: Number,
      required: [true, "El año es obligatorio"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Truck", truckSchema);
