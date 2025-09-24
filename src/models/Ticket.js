// src/models/Ticket.js
import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const TicketSchema = new Schema({
  driver: { type: Types.ObjectId, ref: "Driver", required: true },
  truck: { type: Types.ObjectId, ref: "Truck" }, // opcional, puede añadirse luego
  photoUrl: { type: String, required: true },    // OBLIGATORIO
  date: { type: Date },                          // opcional
  state: { type: String, uppercase: true, match: /^[A-Z]{2}$/ }, // opcional
  gallons: { type: Number, min: 0 },             // opcional
  miles: { type: Number, min: 0 },               // opcional
  pricePerGallon: { type: Number, min: 0 },      // opcional
  mpg: { type: Number },                         // calculado si hay miles & gallons
}, { timestamps: true });

// calcula mpg si hay miles y gallons
TicketSchema.pre("save", function (next) {
  if (this.gallons > 0 && typeof this.miles === "number") {
    this.mpg = Number((this.miles / this.gallons).toFixed(2));
  }
  next();
});

TicketSchema.index({ truck: 1, date: -1 });

export default model("Ticket", TicketSchema);
