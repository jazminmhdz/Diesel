// routes/driversAdmin.routes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";

import {
  getAllDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../controllers/driver.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// GET /api/admin/drivers
router.get("/", getAllDrivers);

// POST /api/admin/drivers
router.post("/", createDriver);

// PUT /api/admin/drivers/:id
router.put("/:id", updateDriver);

// DELETE /api/admin/drivers/:id
router.delete("/:id", deleteDriver);

export default router;
