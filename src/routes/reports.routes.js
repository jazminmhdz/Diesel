// src/routes/reports.routes.js
import express from "express";
import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import Alert from "../models/Alert.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";

const router = express.Router();

// GET /api/reports/alerts (admin)
router.get("/alerts", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 }).populate("truck", "economicNumber").populate("ticket", "mpg date");
  res.json(alerts);
});

// GET /api/reports/rendimiento/:truckId?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/rendimiento/:truckId", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  const { truckId } = req.params;
  const { from, to } = req.query;
  const match = { truck: new mongoose.Types.ObjectId(truckId) };
  if (from) match.date = { ...match.date, $gte: new Date(from) };
  if (to) match.date = { ...match.date, $lte: new Date(to) };

  const data = await Ticket.aggregate([
    { $match: match },
    {
      $project: {
        week: { $isoWeek: "$date" },
        year: { $year: "$date" },
        gallons: "$gallons",
        miles: "$miles",
        mpg: "$mpg"
      }
    },
    {
      $group: {
        _id: { year: "$year", week: "$week" },
        totalGallons: { $sum: "$gallons" },
        totalMiles: { $sum: "$miles" },
        avgMpg: { $avg: "$mpg" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": -1, "_id.week": -1 } }
  ]);

  // map to friendly format
  const out = data.map(d => ({
    year: d._id.year,
    week: d._id.week,
    gallons: d.totalGallons,
    miles: d.totalMiles,
    rendimiento: d.totalGallons > 0 ? Number((d.totalMiles / d.totalGallons).toFixed(2)) : null,
    avgMpg: d.avgMpg ? Number(d.avgMpg.toFixed(2)) : null,
    count: d.count
  }));

  res.json(out);
});

export default router;
