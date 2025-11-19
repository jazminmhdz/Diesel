import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    truck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true, // 🔥 Solo se relaciona con el camión
    },

    miles: {
      type: Number,
      required: [true, "Las millas son obligatorias"],
    },

    gallons: {
      type: Number,
      required: [true, "Los galones son obligatorios"],
    },

    pricePerGallon: {
      type: Number,
      required: [true, "El precio por galón es obligatorio"],
    },

    date: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },

    state: {
      type: String,
      required: [true, "El estado es obligatorio"],
      trim: true,
    },

    photoUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
