import Driver from "../models/Driver.js";
import Truck from "../models/Truck.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* ========================= 🚛 CAMIONES ========================= */

export const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find().populate("driver", "name");
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo camiones", error: err.message });
  }
};

export const createTruck = async (req, res) => {
  try {
    const { economicNumber, vin, model, year, expectedMpgMin, expectedMpgMax } = req.body;
    if (!economicNumber || !vin || !model || !year) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existingTruck = await Truck.findOne({ economicNumber });
    if (existingTruck) {
      return res.status(400).json({ message: "Número económico duplicado" });
    }

    const truck = await Truck.create({
      economicNumber,
      vin,
      model,
      year,
      expectedMpgMin: expectedMpgMin || 4,
      expectedMpgMax: expectedMpgMax || 9,
    });

    res.json(truck);
  } catch (err) {
    res.status(500).json({ message: "Error al crear camión", error: err.message });
  }
};

export const updateTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const truck = await Truck.findByIdAndUpdate(id, req.body, { new: true });
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });
    res.json(truck);
  } catch (err) {
    res.status(500).json({ message: "Error actualizando camión", error: err.message });
  }
};

export const deleteTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const truck = await Truck.findByIdAndDelete(id);
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });
    res.json({ message: "Camión eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando camión", error: err.message });
  }
};

/* ========================= 👨‍🔧 CHOFERES ========================= */

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("assignedTruck", "economicNumber");
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo choferes", error: err.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, driverType, badge } = req.body;

    if (!name || !licenseNumber || !driverType) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Crear chofer
    const driver = await Driver.create({
      name,
      licenseNumber,
      driverType, // "CRUCE" o "LOCAL"
      badge: badge || "",
      assignedTruck: null,
    });

    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: "Error al crear chofer", error: err.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findByIdAndUpdate(id, req.body, { new: true });
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: "Error actualizando chofer", error: err.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findByIdAndDelete(id);
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

    // Liberar camión si tenía uno asignado
    if (driver.assignedTruck) {
      await Truck.findByIdAndUpdate(driver.assignedTruck, { driver: null });
    }

    res.json({ message: "Chofer eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando chofer", error: err.message });
  }
};

/* ========================= 🎟️ TICKETS ========================= */

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("driver", "name")
      .populate("truck", "economicNumber");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo tickets", error: err.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { truckId, gallons, miles, state } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!truckId || !gallons || !miles || !state) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Buscar el chofer asignado al camión
    const truck = await Truck.findById(truckId).populate("driver");
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });
    if (!truck.driver) return res.status(400).json({ message: "Este camión no tiene chofer asignado" });

    // Calcular rendimiento
    const mpg = gallons > 0 ? (miles / gallons).toFixed(2) : 0;

    const ticket = await Ticket.create({
      driver: truck.driver._id,
      truck: truck._id,
      gallons,
      miles,
      state,
      mpg,
      photoUrl,
      date: new Date(),
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Error creando ticket", error: err.message });
  }
};

/* ========================= 🔄 ASIGNACIÓN DE CAMIÓN ========================= */

export const assignTruckToDriver = async (req, res) => {
  try {
    const { driverId, truckId } = req.body;

    if (!driverId || !truckId) {
      return res.status(400).json({ message: "Faltan campos obligatorios (driverId o truckId)" });
    }

    const driver = await Driver.findById(driverId);
    const truck = await Truck.findById(truckId);

    if (!driver || !truck) {
      return res.status(404).json({ message: "Chofer o camión no encontrado" });
    }

    // Verificar si el camión ya está asignado
    if (truck.driver && truck.driver.toString() !== driverId) {
      return res.status(400).json({ message: "Este camión ya está asignado a otro chofer" });
    }

    // Liberar el camión anterior si el chofer ya tenía uno
    if (driver.assignedTruck) {
      await Truck.findByIdAndUpdate(driver.assignedTruck, { driver: null });
    }

    // Asignar el nuevo
    driver.assignedTruck = truck._id;
    truck.driver = driver._id;

    await driver.save();
    await truck.save();

    res.json({
      message: "Camión asignado correctamente al chofer",
      driver: driver.name,
      truck: truck.economicNumber,
    });
  } catch (err) {
    console.error("❌ Error asignando camión:", err);
    res.status(500).json({ message: "Error asignando camión", error: err.message });
  }
};
