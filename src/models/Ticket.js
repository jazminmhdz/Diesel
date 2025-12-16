import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    truck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },

    miles: {
      type: Number,
      required: true,
    },

    gallons: {
      type: Number,
      required: true,
    },

    pricePerGallon: {
      type: Number,
      required: true,
    },

    mpg: {                     // 🔥 AQUI ESTÁ LA CLAVE
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    state: {
      type: String,
      required: true,
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
