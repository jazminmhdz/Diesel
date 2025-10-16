// src/routes/reports.routes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getPerformance, getAlerts } from "../controllers/reports.controller.js";

const router = express.Router();

router.use(authMiddleware);

// 📊 Reporte de rendimiento
router.get("/performance", getPerformance);

// ⚠️ Alertas de bajo rendimiento
router.get("/alerts", getAlerts);

export default router;
