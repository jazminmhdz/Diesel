import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: [true, "El chofer es obligatorio"],
    },

    truck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: [true, "El camión es obligatorio"],
    },

    // Foto opcional
    photoUrl: {
      type: String,
      default: null,
    },

    // Fecha en que se cargó gasolina
    date: {
      type: Date,
      default: Date.now,
    },

    // Estado (TX, CA, NM, AZ, etc.)
    state: {
      type: String,
      required: [true, "El estado donde se cargó gasolina es obligatorio"],
      uppercase: true,
      trim: true,
    },

    gallons: {
      type: Number,
      required: [true, "Los galones son obligatorios"],
      min: [0.1, "Los galones deben ser mayores a 0"],
    },

    miles: {
      type: Number,
      required: [true, "Las millas son obligatorias"],
      min: [1, "Las millas deben ser mayores a 0"],
    },

    pricePerGallon: {
      type: Number,
      default: 0,
    },

    // Se calcula automáticamente
    mpg: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// 🔥 Middleware para calcular MPG automáticamente:
ticketSchema.pre("save", function (next) {
  if (this.gallons > 0 && this.miles > 0) {
    this.mpg = Number((this.miles / this.gallons).toFixed(2));
  }
  next();
});

export default mongoose.model("Ticket", ticketSchema);
