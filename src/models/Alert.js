import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const alertSchema = new Schema(
  {
    truck: { type: Types.ObjectId, ref: "Truck", required: true },
    ticket: { type: Types.ObjectId, ref: "Ticket", required: true },
    type: { type: String, enum: ["LOW_MPG", "HIGH_MPG"], required: true },
    value: { type: Number, required: true },
    min: { type: Number },
    max: { type: Number },
    resolved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Alert = model("Alert", alertSchema);

export default Alert;
