// src/controllers/driver.controller.js
import Driver from "../models/Driver.js";
import Truck from "../models/Truck.js";
import Ticket from "../models/Ticket.js";

/**
 * Controlador con funciones reutilizables:
 * - funciones admin (CRUD)
 * - funciones "driver" (perfil / my-truck / my-tickets)
 *
 * Nota: las rutas admin siguen usando admin.controller.js
 * y pueden llamar a estas funciones si quieres reutilizar.
 */

// ---------------------------
// ADMIN: CRUD (puedes usar desde admin.controller)
// ---------------------------
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("truckAssigned");
    res.json(drivers);
  } catch (err) {
    console.error("Error obteniendo choferes:", err);
    res.status(500).json({ message: "Error obteniendo choferes" });
  }
};

export const createDriver = async (req, res) => {
  try {
    // Soportar campos en español/inglés por compatibilidad
    const {
      nombre,
      numLicencia,
      numGafete,
      fullName,
      licenseNumber,
      badgeNumber,
      tipo,
      truckAssigned,
    } = req.body;

    const name = nombre || fullName;
    const license = numLicencia || licenseNumber;
    const badge = numGafete || badgeNumber || null;

    if (!name || !license || !tipo) {
      return res.status(400).json({ message: "nombre, numLicencia y tipo son obligatorios" });
    }

    // Validar duplicado de licencia
    const exists = await Driver.findOne({ numLicencia: license });
    if (exists) {
      return res.status(409).json({ message: "La licencia ya está registrada" });
    }

    const driver = await Driver.create({
      nombre: name,
      numLicencia: license,
      numGafete: badge,
      tipo,
      truckAssigned: truckAssigned || null,
    });

    // Si se asignó truckAssigned, marcar en Truck.assignedTo si aplica
    if (truckAssigned) {
      await Truck.findByIdAndUpdate(truckAssigned, { driver: driver._id }).catch(() => {});
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
    const {
      nombre,
      fullName,
      numLicencia,
      licenseNumber,
      numGafete,
      badgeNumber,
      tipo,
      truckAssigned,
    } = req.body;

    const update = {};
    if (nombre || fullName) update.nombre = nombre || fullName;
    if (numLicencia || licenseNumber) update.numLicencia = numLicencia || licenseNumber;
    if (numGafete || badgeNumber) update.numGafete = numGafete || badgeNumber;
    if (tipo) update.tipo = tipo;
    if (truckAssigned !== undefined) update.truckAssigned = truckAssigned || null;

    // Validar duplicado licencia (excepto mismo)
    if (update.numLicencia) {
      const exists = await Driver.findOne({
        numLicencia: update.numLicencia,
        _id: { $ne: id },
      });
      if (exists) return res.status(409).json({ message: "Otra cuenta tiene esa licencia" });
    }

    const driver = await Driver.findByIdAndUpdate(id, update, { new: true }).populate(
      "truckAssigned"
    );

    if (!driver) return res.status(404).json({ message: "Chofer no encontrado" });

    // Si se asignó/quitó truckAssigned, sincronizar Truck.driver (opcional)
    try {
      if (truckAssigned) {
        await Truck.findByIdAndUpdate(truckAssigned, { driver: driver._id });
      }
    } catch (e) {
      // no bloqueamos la respuesta por fallo en sincronizar el truck
      console.warn("No se pudo sincronizar Truck.driver:", e.message);
    }

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

    // limpiar referencia en camión si existía
    if (deleted.truckAssigned) {
      await Truck.findByIdAndUpdate(deleted.truckAssigned, { driver: null }).catch(() => {});
    }

    res.json({ message: "Chofer eliminado correctamente" });
  } catch (err) {
    console.error("Error eliminando chofer:", err);
    res.status(500).json({ message: "Error eliminando chofer" });
  }
};

// ---------------------------
// DRIVER (endpoints para la app del chofer)
// ---------------------------

// Obtener perfil del chofer (usa req.user.driverRef)
export const getDriverProfile = async (req, res) => {
  try {
    const driverId = req.user?.driverRef;
    if (!driverId) return res.status(400).json({ message: "No hay referencia de chofer en el usuario" });

    const driver = await Driver.findById(driverId).populate("truckAssigned");
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

    const driver = await Driver.findById(driverId).populate("truckAssigned");
    if (!driver || !driver.truckAssigned) {
      return res.status(404).json({ message: "No tienes camión asignado" });
    }

    res.json(driver.truckAssigned);
  } catch (err) {
    console.error("Error getMyTruck:", err);
    res.status(500).json({ message: "Error al obtener camión asignado" });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const driverId = req.user?.driverRef;
    if (!driverId) return res.status(400).json({ message: "No hay referencia de chofer en el usuario" });

    const tickets = await Ticket.find({ driver: driverId }).sort({ date: -1 }).populate("truck");
    res.json(tickets);
  } catch (err) {
    console.error("Error getMyTickets:", err);
    res.status(500).json({ message: "Error al obtener tickets" });
  }
};
