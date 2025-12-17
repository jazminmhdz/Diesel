// src/controllers/reports.controller.js
import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";

// ===============================
// 📊 RENDIMIENTO POR CAMIÓN
// ===============================
export const getPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const tickets = await Ticket.find(filter).populate(
      "truck",
      "economicNumber"
    );

    const stats = {};

    tickets.forEach((t) => {
      if (!t.truck) return;

      const truckId = t.truck._id.toString();

      if (!stats[truckId]) {
        stats[truckId] = {
          truck: t.truck.economicNumber,
          miles: 0,
          gallons: 0,
          tickets: 0,
        };
      }

      stats[truckId].miles += t.miles;
      stats[truckId].gallons += t.gallons;
      stats[truckId].tickets += 1;
    });

    const result = Object.values(stats).map((t) => ({
      truck: t.truck,
      totalMiles: t.miles,
      totalGallons: t.gallons,
      avgMpg: t.gallons > 0 ? t.miles / t.gallons : 0,
      tickets: t.tickets,
    }));

    res.json(result);
  } catch (error) {
    console.error("❌ Error en rendimiento:", error);
    res.status(500).json({
      message: "Error generando reporte de rendimiento",
      error: error.message,
    });
  }
};

// ===============================
// ⚠️ ALERTAS DE BAJO RENDIMIENTO
// ===============================
export const getAlerts = async (req, res) => {
  try {
    const { minMpg = 5 } = req.query;

    const tickets = await Ticket.find().populate(
      "truck",
      "economicNumber"
    );

    const alerts = [];

    tickets.forEach((t) => {
      const mpg = t.gallons > 0 ? t.miles / t.gallons : 0;

      if (mpg < Number(minMpg)) {
        alerts.push({
          truck: t.truck?.economicNumber || "N/A",
          mpg,
          miles: t.miles,
          gallons: t.gallons,
          date: t.date,
          state: t.state,
        });
      }
    });

    res.json(alerts);
  } catch (error) {
    console.error("❌ Error en alertas:", error);
    res.status(500).json({
      message: "Error obteniendo alertas",
      error: error.message,
    });
  }
};
