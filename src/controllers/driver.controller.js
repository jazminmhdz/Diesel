// controllers/driver.controller.js
import Driver from "../models/Driver.js";
import Truck from "../models/Truck.js";
import Ticket from "../models/Ticket.js";

// ---------------------------
// ADMIN CRUD
// ---------------------------
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("assignedTruck");
    res.json(drivers);
  } catch (err) {
    console.error("Error obteniendo choferes:", err);
    res.status(500).json({ message: "Error obteniendo choferes" });
  }
};

export const createDriver = async (req, res) => {
  try {
    const { fullName, licenseNumber, gafeteNumber, type, assignedTruck } = req.body;

    if (!fullName || !licenseNumber || !type) {
      return res.status(400).json({ message: "fullName, licenseNumber y type son obligatorios" });
    }

    const exists = await Driver.findOne({ licenseNumber });
    if (exists) {
      return res.status(409).json({ message: "La licencia ya está registrada" });
    }

    const driver = await Driver.create({
      fullName,
      licenseNumber,
      gafeteNumber: gafeteNumber || null,
      type,
      assignedTruck: assignedTruck || null,
    });

    if (assignedTruck) {
      await Truck.findByIdAndUpdate(assignedTruck, { driver: driver._id });
    }

    res.status(201).json(driver);
  } catch (err) {
    console.error("Error creando chofer:", err);
    res.status(500).json({ message: "Error creando chofer" });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, licenseNumber, gafeteNumber, type, assignedTruck } = req.body;

    const update = {};
    if (fullName) update.fullName = fullName;
    if (licenseNumber) update.licenseNumber = licenseNumber;
    if (gafeteNumber) update.gafeteNumber = gafeteNumber;
    if (type) update.type = type;
    if (assignedTruck !== undefined) update.assignedTruck = assignedTruck;

    if (licenseNumber) {
      const exists = await Driver.findOne({
        licenseNumber,
        _id: { $ne: id },
      });
      if (exists) {
        return res.status(409).json({ message: "Otra cuenta tiene esa licencia" });
      }
    }

    const driver = await Driver.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("assignedTruck");

    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

    res.json(driver);
  } catch (err) {
    console.error("Error actualizando chofer:", err);
    res.status(500).json({ message: "Error actualizando chofer" });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const deleted = await Driver.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Chofer no encontrado" });

    if (deleted.assignedTruck) {
      await Truck.findByIdAndUpdate(deleted.assignedTruck, { driver: null });
    }

    res.json({ message: "Chofer eliminado correctamente" });
  } catch (err) {
    console.error("Error eliminando chofer:", err);
    res.status(500).json({ message: "Error eliminando chofer" });
  }
};

// ---------------------------
// DRIVER (APP CHOFER)
// ---------------------------
export const getDriverProfile = async (req, res) => {
  try {
    const driverId = req.user?.driverRef;
    if (!driverId) return res.status(400).json({ message: "No hay referencia de chofer en el usuario" });

    const driver = await Driver.findById(driverId).populate("assignedTruck");
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

    res.json(driver);
  } catch (err) {
    console.error("Error getDriverProfile:", err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};

export const getMyTruck = async (req, res) => {
  try {
    const driverId = req.user?.driverRef;
    if (!driverId) return res.status(400).json({ message: "No hay referencia de chofer en el usuario" });

    const driver = await Driver.findById(driverId).populate("assignedTruck");
    if (!driver || !driver.assignedTruck) {
      return res.status(404).json({ message: "No tienes camión asignado" });
    }

    res.json(driver.assignedTruck);
  } catch (err) {
    console.error("Error getMyTruck:", err);
    res.status(500).json({ message: "Error al obtener camión asignado" });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const driverId = req.user?.driverRef;
    if (!driverId) return res.status(400).json({ message: "No hay referencia de chofer" });

    const tickets = await Ticket.find({ driver: driverId })
      .sort({ date: -1 })
      .populate("truck");

    res.json(tickets);
  } catch (err) {
    console.error("Error getMyTickets:", err);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
};
