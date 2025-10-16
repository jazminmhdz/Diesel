// src/controllers/reports.controller.js
import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";

// 📊 Rendimiento semanal por camión
export const getPerformance = async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const tickets = await Ticket.find({ date: { $gte: weekAgo } }).populate(
      "truck",
      "economicNumber"
    );

    const stats = {};
    for (const t of tickets) {
      const truckNum = t.truck?.economicNumber || "Desconocido";
      if (!stats[truckNum]) stats[truckNum] = { miles: 0, gallons: 0, count: 0 };
      stats[truckNum].miles += t.miles;
      stats[truckNum].gallons += t.gallons;
      stats[truckNum].count++;
    }

    const result = Object.keys(stats).map((truck) => {
      const { miles, gallons, count } = stats[truck];
      const avgMpg = gallons > 0 ? miles / gallons : 0;
      return { truck, miles, gallons, avgMpg, registros: count };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error generando reporte", error: err.message });
  }
};

// ⚠️ Alertas de bajo rendimiento
export const getAlerts = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("truck", "economicNumber expectedMpgMin")
      .sort({ date: -1 })
      .limit(20);

    const alerts = tickets
      .filter(
        (t) =>
          t.truck?.expectedMpgMin &&
          t.mpg < Number(t.truck.expectedMpgMin)
      )
      .map((t) => ({
        truck: t.truck?.economicNumber,
        mpg: t.mpg,
        minExpected: t.truck?.expectedMpgMin,
        date: t.date,
        state: t.state,
      }));

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo alertas", error: err.message });
  }
};
