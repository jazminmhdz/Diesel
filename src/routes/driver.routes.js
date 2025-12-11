// src/routes/driver.routes.js
import express from "express";
import multer from "multer";
import mongoose from "mongoose";

import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";

import Driver from "../models/Driver.js";
import Ticket from "../models/Ticket.js";
import Alert from "../models/Alert.js";
import Truck from "../models/Truck.js";

import {
  getDriverProfile,
  getMyTruck,
  getMyTickets,
} from "../controllers/driver.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// app chofer
router.use(authMiddleware);
router.use(roleMiddleware("driver"));

router.get("/me", getDriverProfile);
router.get("/my-truck", getMyTruck);
router.get("/my-tickets", getMyTickets);

router.get("/my-alerts", async (req, res) => {
  try {
    const driverId = req.user?.driverRef;
    if (!driverId) return res.status(400).json({ message: "No hay referencia de chofer" });

    const driver = await Driver.findById(driverId);
    if (!driver || !driver.assignedTruck)
      return res.status(404).json({ message: "No tienes camión asignado" });

    const alerts = await Alert.find({ truck: driver.assignedTruck }).sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    console.error("Error /driver/my-alerts:", err);
    res.status(500).json({ message: "Error al obtener alertas" });
  }
});

router.post("/tickets", upload.single("photo"), async (req, res) => {
  try {
    const driverId = req.user?.driverRef;

    if (!driverId) return res.status(400).json({ message: "No hay referencia de chofer" });

    const { date, state, gallons, miles, pricePerGallon, truckId } = req.body;

    if (!truckId || !gallons || !miles || !state)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const truck = await Truck.findById(truckId);
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });

    const ticket = await Ticket.create({
      driver: new mongoose.Types.ObjectId(driverId),
      truck: new mongoose.Types.ObjectId(truckId),
      photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
      date: date ? new Date(date) : new Date(),
      state,
      gallons: Number(gallons),
      miles: Number(miles),
      pricePerGallon: pricePerGallon ? Number(pricePerGallon) : 0,
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error POST /driver/tickets:", err);
    res.status(500).json({ message: "Error al subir ticket", error: err.message });
  }
});

export default router;
