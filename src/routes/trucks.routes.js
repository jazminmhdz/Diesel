// src/routes/trucks.routes.js
import express from "express";
import multer from "multer";

import {
  getAllTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck
} from "../controllers/trucks.controller.js";

const router = express.Router();

// 📸 Configuración de Multer para subir imagen
const upload = multer({ dest: "uploads/" });

// ===============================
// 🚚 RUTAS DE CAMIONES (ADMIN)
// ===============================

// Obtener todos los camiones
router.get("/", getAllTrucks);

// Obtener camión por ID
router.get("/:id", getTruckById);

// Crear camión
router.post("/", upload.single("image"), createTruck);

// Actualizar camión
router.put("/:id", upload.single("image"), updateTruck);

// Eliminar camión
router.delete("/:id", deleteTruck);

export default router;
