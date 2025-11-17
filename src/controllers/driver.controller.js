// src/controllers/driver.controller.js
import Driver from "../models/Driver.js";
import Ticket from "../models/Ticket.js";
import Truck from "../models/Truck.js";

/**
 * Admin: obtener todos los choferes (con camión asignado)
 */
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("truckAssigned");
    res.json(drivers);
  } catch (err) {
    console.error("Error getAllDrivers:", err);
    res.status(500).json({ message: "Error obteniendo choferes" });
  }
};

/**
 * Admin: crear chofer
 * Acepta tanto { fullName, licenseNumber, badgeNumber, tipo } como { nombre, numLicencia, numGafete, tipo }
 */
export const createDriver = async (req, res) => {
  try {
    const body = req.body || {};
    const nombre = body.nombre || body.fullName || body.name;
    const numLicencia = body.numLicencia || body.licenseNumber;
    const numGafete = body.numGafete || body.badgeNumber || null;
    const tipo = body.tipo || body.driverType || "LOCAL"; // default

    if (!nombre || !numLicencia) {
      return res.status(400).json({ message: "Nombre y número de licencia son obligatorios" });
    }

    // duplicados (licencia única)
    const exists = await Driver.findOne({ numLicencia });
    if (exists) return res.status(409).json({ message: "La licencia ya está registrada" });

    const driver = await Driver.create({
      nombre,
      numLicencia,
      numGafete,
      tipo,
    });

    res.status(201).json(driver);
  } catch (err) {
    console.error("Error createDriver:", err);
    res.status(500).json({ message: "Error creando chofer" });
  }
};

/**
 * Admin: actualizar chofer
 * Mapea campos entrantes a los del modelo
 */
export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const update = {};

    if (body.fullName || body.name || body.nombre) update.nombre = body.fullName || body.name || body.nombre;
    if (body.licenseNumber || body.numLicencia) update.numLicencia = body.licenseNumber || body.numLicencia;
    if (body.badgeNumber || body.numGafete) update.numGafete = body.badgeNumber || body.numGafete;
    if (body.tipo || body.driverType) update.tipo = body.tipo || body.driverType;
    if (body.truckAssigned) update.truckAssigned = body.truckAssigned;

    // validar duplicado de licencia (excepto el mismo)
    if (update.numLicencia) {
      const exists = await Driver.findOne({ numLicencia: update.numLicencia, _id: { $ne: id } });
      if (exists) return res.status(409).json({ message: "Ya existe otro chofer con esta licencia" });
    }

    const updated = await Driver.findByIdAndUpdate(id, update, { new: true }).populate("truckAssigned");
    if (!updated) return res.status(404).json({ message: "Chofer no encontrado" });

    res.json(updated);
  } catch (err) {
    console.error("Error updateDriver:", err);
    res.status(500).json({ message: "Error actualizando chofer" });
  }
};

/**
 * Admin: eliminar chofer
 */
export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    // opcional: desasignar camión si existe
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

    // si tiene truckAssigned, limpiar assignedTo en Truck
    if (driver.truckAssigned) {
      await Truck.findByIdAndUpdate(driver.truckAssigned, { assignedTo: null });
    }

    await Driver.findByIdAndDelete(id);
    res.json({ message: "Chofer eliminado" });
  } catch (err) {
    console.error("Error deleteDriver:", err);
    res.status(500).json({ message: "Error eliminando chofer" });
  }
};

/* ---------------- Driver (endpoints pensados para rol driver) ---------------- */

/**
 * Driver: obtener su perfil (usa req.user.driverRef)
 */
export const getDriverProfile = async (req, res) => {
  try {
    const driverRef = req.user?.driverRef || req.user?.driverId;
    if (!driverRef) return res.status(400).json({ message: "DriverRef faltante en token" });

    const driver = await Driver.findById(driverRef).populate("truckAssigned");
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });
    res.json(driver);
  } catch (err) {
    console.error("Error getDriverProfile:", err);
    res.status(500).json({ message: "Error obteniendo perfil" });
  }
};

/**
 * Driver: obtener camión asignado
 */
export const getDriverAssignedTruck = async (req, res) => {
  try {
    const driverRef = req.user?.driverRef || req.user?.driverId;
    if (!driverRef) return res.status(400).json({ message: "DriverRef faltante en token" });

    const driver = await Driver.findById(driverRef).populate("truckAssigned");
    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

    res.json(driver.truckAssigned || null);
  } catch (err) {
    console.error("Error getDriverAssignedTruck:", err);
    res.status(500).json({ message: "Error obteniendo camión asignado" });
  }
};

/**
 * Driver: historial de tickets propios
 */
export const getDriverTickets = async (req, res) => {
  try {
    const driverRef = req.user?.driverRef || req.user?.driverId;
    if (!driverRef) return res.status(400).json({ message: "DriverRef faltante en token" });

    const tickets = await Ticket.find({ driver: driverRef }).sort({ date: -1 }).populate("truck");
    res.json(tickets);
  } catch (err) {
    console.error("Error getDriverTickets:", err);
    res.status(500).json({ message: "Error obteniendo tickets del chofer" });
  }
};
