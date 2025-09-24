// src/routes/admin.routes.js
import express from "express";
import bcrypt from "bcryptjs"; 
import Truck from "../models/Truck.js";
import Driver from "../models/Driver.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";

const router = express.Router();

// --- TRUCKS ---
// GET /api/admin/trucks
router.get("/trucks", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  const trucks = await Truck.find();
  res.json(trucks);
});

// POST /api/admin/trucks
router.post("/trucks", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { economicNumber, vin, model, year, expectedMpgMin, expectedMpgMax } = req.body;
    const truck = await Truck.create({ economicNumber, vin, model, year, expectedMpgMin, expectedMpgMax });
    res.status(201).json(truck);
  } catch (err) {
    console.error("Error crear camión", err);
    res.status(500).json({ message: "Error al crear camión", error: err.message });
  }
});

// GET /api/admin/trucks/:id -> devuelve camión + historial de tickets
router.get("/trucks/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  const { id } = req.params;
  const truck = await Truck.findById(id);
  if (!truck) return res.status(404).json({ message: "Camión no encontrado" });

  const tickets = await Ticket.find({ truck: truck._id }).sort({ date: -1 });
  res.json({ truck, tickets });
});

// --- DRIVERS ---
// GET /api/admin/drivers
router.get("/drivers", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  const drivers = await Driver.find()
    .populate("assignedTruck")
    .populate("userRef", "email");
  res.json(drivers);
});

// POST /api/admin/drivers -> crea Driver + User (password hash)
router.post("/drivers", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { name, licenseNumber, badge, email, password } = req.body;
    if (!name || !licenseNumber || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // crea driver
    const driver = await Driver.create({ name, licenseNumber, badge });

    // crea usuario asociado
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: passwordHash, role: "driver", driverRef: driver._id });

    // link
    driver.userRef = user._id;
    await driver.save();

    res.status(201).json({ driver, user });
  } catch (err) {
    console.error("Error crear chofer", err);
    res.status(500).json({ message: "Error al crear chofer", error: err.message });
  }
});

// --- TICKETS ---
// PUT /api/admin/tickets/:id -> editar ticket (llenar campos faltantes)
router.put("/tickets/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const ticket = await Ticket.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });
    res.json(ticket);
  } catch (err) {
    console.error("Error actualizar ticket", err);
    res.status(500).json({ message: "Error al actualizar ticket", error: err.message });
  }
});

// GET /api/admin/tickets -> listar todos los tickets
router.get("/tickets", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  const tickets = await Ticket.find()
    .sort({ createdAt: -1 })
    .populate("driver", "name")
    .populate("truck", "economicNumber");
  res.json(tickets);
});

export default router;
