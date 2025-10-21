import express from "express";
import {
  getAllDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  getAllTrucks,
  createTruck,
  updateTruck,
  deleteTruck,
  getAllTickets,
  createTicket,
  assignTruckToDriver,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* ---------------- 🔐 Middleware de autenticación ---------------- */
router.use(authMiddleware);

/* ========================= 🚛 CAMIONES ========================= */
router.get("/trucks", getAllTrucks);
router.post("/trucks", createTruck);
router.put("/trucks/:id", updateTruck);
router.delete("/trucks/:id", deleteTruck);

/* ========================= 👨‍🔧 CHOFERES ========================= */
router.get("/drivers", getAllDrivers);
router.post("/drivers", createDriver);
router.put("/drivers/:id", updateDriver);
router.delete("/drivers/:id", deleteDriver);

/* ========================= 🎟️ TICKETS ========================= */
router.get("/tickets", getAllTickets);
router.post("/tickets", upload.single("photo"), createTicket);

/* ========================= 🔄 ASIGNACIÓN DE CAMIONES ========================= */
// POST /api/admin/assign-truck
router.post("/assign-truck", assignTruckToDriver);

export default router;
