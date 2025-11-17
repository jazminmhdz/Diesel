import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";

import Driver from "../models/Driver.js";
import Ticket from "../models/Ticket.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                           1. OBTENER TODOS LOS CHOFERES                   */
/* -------------------------------------------------------------------------- */
router.get("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    console.error("❌ Error GET /drivers:", err);
    res.status(500).json({ message: "Error al obtener choferes" });
  }
});

/* -------------------------------------------------------------------------- */
/*                        2. OBTENER CHOFER POR ID                            */
/* -------------------------------------------------------------------------- */
router.get("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const driverId = new mongoose.Types.ObjectId(req.params.id);
    const driver = await Driver.findById(driverId);

    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

    res.json(driver);
  } catch (err) {
    console.error("❌ Error GET /drivers/:id:", err);
    res.status(500).json({ message: "Error al obtener el chofer" });
  }
});

/* -------------------------------------------------------------------------- */
/*                           3. CREAR CHOFER                                   */
/* -------------------------------------------------------------------------- */
router.post("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name, phone, licenseNumber } = req.body;

    const newDriver = await Driver.create({
      name,
      phone,
      licenseNumber,
    });

    res.status(201).json(newDriver);
  } catch (err) {
    console.error("❌ Error POST /drivers:", err);
    res.status(500).json({ message: "Error al crear chofer" });
  }
});

/* -------------------------------------------------------------------------- */
/*                           4. ACTUALIZAR CHOFER                             */
/* -------------------------------------------------------------------------- */
router.put("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const driverId = new mongoose.Types.ObjectId(req.params.id);

    const updated = await Driver.findByIdAndUpdate(driverId, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Chofer no encontrado" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error PUT /drivers/:id:", err);
    res.status(500).json({ message: "Error al actualizar chofer" });
  }
});

/* -------------------------------------------------------------------------- */
/*                           5. ELIMINAR CHOFER                               */
/* -------------------------------------------------------------------------- */
router.delete("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const driverId = new mongoose.Types.ObjectId(req.params.id);

    const deleted = await Driver.findByIdAndDelete(driverId);

    if (!deleted) return res.status(404).json({ message: "Chofer no encontrado" });

    res.json({ message: "Chofer eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error DELETE /drivers/:id:", err);
    res.status(500).json({ message: "Error al eliminar chofer" });
  }
});

/* -------------------------------------------------------------------------- */
/*                  6. OBTENER LOS TICKETS DE UN CHOFER                       */
/* -------------------------------------------------------------------------- */
router.get(
  "/:id/tickets",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const driverId = new mongoose.Types.ObjectId(req.params.id);

      const tickets = await Ticket.find({ driver: driverId })
        .sort({ date: -1 })
        .populate("truck", "economicNumber model year");

      res.json(tickets);
    } catch (err) {
      console.error("❌ Error GET /drivers/:id/tickets:", err);
      res.status(500).json({ message: "Error al obtener tickets del chofer" });
    }
  }
);

export default router;
