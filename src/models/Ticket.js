import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    truck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },
    photoUrl: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    state: {
      type: String,
      required: true,
    },
    gallons: {
      type: Number,
      required: true,
    },
    miles: {
      type: Number,
      required: true,
    },
    pricePerGallon: {
      type: Number,
      default: 0,
    },
    mpg: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
