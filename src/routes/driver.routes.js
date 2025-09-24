import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";

import Driver from "../models/Driver.js";
import Ticket from "../models/Ticket.js";
import Alert from "../models/Alert.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // guarda fotos localmente

// 1) Ver perfil del chofer
router.get("/me", authMiddleware, roleMiddleware("driver"), async (req, res) => {
  try {
    const driverId = new mongoose.Types.ObjectId(req.user.driverRef);
    const driver = await Driver.findById(driverId).populate("assignedTruck");
    if (!driver) {
      return res.status(404).json({ message: "Chofer no encontrado" });
    }
    res.json(driver);
  } catch (err) {
    console.error("❌ Error en /driver/me:", err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});

// 2) Ver camión asignado
router.get("/my-truck", authMiddleware, roleMiddleware("driver"), async (req, res) => {
  try {
    const driverId = new mongoose.Types.ObjectId(req.user.driverRef);
    const driver = await Driver.findById(driverId).populate("assignedTruck");
    if (!driver || !driver.assignedTruck) {
      return res.status(404).json({ message: "No tienes camión asignado" });
    }
    res.json(driver.assignedTruck);
  } catch (err) {
    console.error("❌ Error en /driver/my-truck:", err);
    res.status(500).json({ message: "Error al obtener camión asignado" });
  }
});

// 3) Historial de tickets propios
router.get("/my-tickets", authMiddleware, roleMiddleware("driver"), async (req, res) => {
  try {
    const driverId = new mongoose.Types.ObjectId(req.user.driverRef);
    const tickets = await Ticket.find({ driver: driverId })
      .sort({ date: -1 })
      .populate("truck", "economicNumber model year");
    res.json(tickets);
  } catch (err) {
    console.error("❌ Error en /driver/my-tickets:", err);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
});

// 4) Ver alertas de su camión
router.get("/my-alerts", authMiddleware, roleMiddleware("driver"), async (req, res) => {
  try {
    const driverId = new mongoose.Types.ObjectId(req.user.driverRef);
    const driver = await Driver.findById(driverId);
    if (!driver || !driver.assignedTruck) {
      return res.status(404).json({ message: "No tienes camión asignado" });
    }
    const alerts = await Alert.find({ truck: driver.assignedTruck }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error("❌ Error en /driver/my-alerts:", err);
    res.status(500).json({ message: "Error al obtener alertas" });
  }
});

// 5) Subir ticket con foto
router.post(
  "/tickets",
  authMiddleware,
  roleMiddleware("driver"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const driverId = new mongoose.Types.ObjectId(req.user.driverRef);
      const { date, state, gallons, miles, pricePerGallon, truckId } = req.body;

      const ticket = await Ticket.create({
        driver: driverId,
        truck: truckId,
        photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
        date,
        state,
        gallons,
        miles,
        pricePerGallon,
      });

      res.status(201).json(ticket);
    } catch (err) {
      console.error("❌ Error en POST /driver/tickets:", err);
      res.status(500).json({ message: "Error al subir ticket", error: err.message });
    }
  }
);

export default router;
