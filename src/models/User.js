// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hash bcrypt
    role: { type: String, enum: ["admin", "driver"], default: "driver" },
    driverRef: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
