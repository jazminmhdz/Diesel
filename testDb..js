import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: "admin@diesel.local" });
    console.log(user);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
