// src/routes/driversAdmin.routes.js
import { Router } from "express";
import Driver from "../models/Driver.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

/**
 * Crear chofer
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, phone, license } = req.body;

    const driver = await Driver.create({ name, phone, license });

    res.status(201).json({
      message: "Chofer creado correctamente",
      driver,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear chofer", error: error.message });
  }
});

/**
 * Obtener todos los choferes
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener choferes", error: error.message });
  }
});

/**
 * Obtener chofer por ID
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Chofer no encontrado" });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar chofer", error: error.message });
  }
});

/**
 * Actualizar chofer
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Chofer no encontrado" });
    }
    res.json({ message: "Chofer actualizado", updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar chofer", error: error.message });
  }
});

/**
 * Eliminar chofer
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Driver.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Chofer no encontrado" });
    }
    res.json({ message: "Chofer eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar chofer", error: error.message });
  }
});

export default router;
