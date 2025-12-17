import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";

// =======================================
// 📊 RENDIMIENTO GENERAL POR CAMIÓN
// =======================================
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
          truckId,
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
      truckId: t.truckId,
      truck: t.truck,
      totalMiles: t.miles,
      totalGallons: t.gallons,
      avgMpg: t.gallons > 0 ? t.miles / t.gallons : 0,
      tickets: t.tickets,
    }));

    res.json(result);
  } catch (error) {
    console.error("❌ Error rendimiento:", error);
    res.status(500).json({
      message: "Error generando reporte de rendimiento",
      error: error.message,
    });
  }
};

// =======================================
// 🚛 RENDIMIENTO POR CAMIÓN ESPECÍFICO
// =======================================
export const getPerformanceByTruck = async (req, res) => {
  try {
    const { truckId } = req.params;
    const { startDate, endDate } = req.query;

    const truck = await Truck.findById(truckId);
    if (!truck) {
      return res.status(404).json({ message: "Camión no encontrado" });
    }

    const filter = { truck: truckId };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const tickets = await Ticket.find(filter);

    let totalMiles = 0;
    let totalGallons = 0;

    tickets.forEach((t) => {
      totalMiles += t.miles;
      totalGallons += t.gallons;
    });

    const avgMpg = totalGallons > 0 ? totalMiles / totalGallons : 0;

    res.json({
      truckId: truck._id,
      truck: truck.economicNumber,
      totalMiles,
      totalGallons,
      avgMpg,
      tickets: tickets.length,
    });
  } catch (error) {
    console.error("❌ Error rendimiento camión:", error);
    res.status(500).json({
      message: "Error obteniendo rendimiento del camión",
      error: error.message,
    });
  }
};

// =======================================
// ⚠️ ALERTAS DE BAJO RENDIMIENTO
// =======================================
export const getAlerts = async (req, res) => {
  try {
    const { minMpg = 5 } = req.query;

    const tickets = await Ticket.find().populate(
      "truck",
      "economicNumber"
    );

    const alerts = [];

    tickets.forEach((t) => {
      if (!t.truck) return;

      const mpg = t.gallons > 0 ? t.miles / t.gallons : 0;

      if (mpg < Number(minMpg)) {
        alerts.push({
          truck: t.truck.economicNumber,
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
    console.error("❌ Error alertas:", error);
    res.status(500).json({
      message: "Error obteniendo alertas",
      error: error.message,
    });
  }
};
