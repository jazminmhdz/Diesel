import { Router } from "express";
import { getPerformance, getAlerts } from "../controllers/reports.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";

const router = Router();

// Solo ADMIN ve reportes
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// 📊 Rendimiento semanal
router.get("/performance", getPerformance);

// ⚠️ Alertas de bajo rendimiento
router.get("/alerts", getAlerts);

export default router;
