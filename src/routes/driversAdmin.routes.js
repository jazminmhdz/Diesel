// routes/driversAdmin.routes.js
import express from "express";
import Driver from "../models/Driver.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// GET /drivers - lista choferes
router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find().populate("assignedTruck");
    res.json(drivers);
  } catch (err) {
    console.error("GET /drivers error:", err);
    res.status(500).json({ message: "Error cargando choferes" });
  }
});

export default router;
