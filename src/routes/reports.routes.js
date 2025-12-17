import { Router } from "express";
import {
  getPerformance,
  getPerformanceByTruck,
  getAlerts,
} from "../controllers/reports.controller.js";

const router = Router();

// 📊 Rendimiento general
router.get("/performance", getPerformance);

// 🚛 Rendimiento por camión específico
router.get("/performance/:truckId", getPerformanceByTruck);

// ⚠️ Alertas
router.get("/alerts", getAlerts);

export default router;
