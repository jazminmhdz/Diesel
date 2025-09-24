// src/db.js
import mongoose from "mongoose";

const connect = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Error conectando MongoDB:", err);
    throw err;
  }
};

export default connect;
