// src/routes/admin.routes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { adminController } from "../controllers/admin.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// 🧩 Middleware de autenticación (solo admins)
router.use(authMiddleware);

// ==========================
// 👨‍🔧 CHOFERES
// ==========================
router.get("/drivers", adminController.getDrivers);
router.post("/drivers", adminController.createDriver);
router.put("/drivers/:id", adminController.updateDriver);
router.delete("/drivers/:id", adminController.deleteDriver);

// ==========================
// 🚛 CAMIONES
// ==========================
router.get("/trucks", adminController.getTrucks);
router.post("/trucks", adminController.createTruck);
router.put("/trucks/:id", adminController.updateTruck);
router.delete("/trucks/:id", adminController.deleteTruck);

// ==========================
// 🔄 ASIGNAR CAMIÓN A CHOFER
// ==========================
router.post("/assign-truck", adminController.assignTruck);

// ==========================
// 🎟️ TICKETS
// ==========================
router.get("/tickets", adminController.getTickets);
// Si quieres permitir crear tickets desde el panel admin (opcional):
// router.post("/tickets", upload.single("photo"), adminController.createTicket);

export default router;
