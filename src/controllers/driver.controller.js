// controllers/driver.controller.js
import Driver from "../models/Driver.js";
import Truck from "../models/Truck.js";

// ======================================================
// ADMIN – CRUD COMPLETO (NO EXISTE APP DE CHOFER)
// ======================================================

// ----------------------------------------
// GET ALL – Listar todos los choferes
// ----------------------------------------
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("assignedTruck");
    res.json(drivers);
  } catch (err) {
    console.error("Error obteniendo choferes:", err);
    res.status(500).json({ message: "Error obteniendo choferes" });
  }
};

// ----------------------------------------
// GET ONE – Buscar chofer por ID
// ----------------------------------------
export const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findById(id).populate("assignedTruck");
    if (!driver) {
      return res.status(404).json({ message: "Chofer no encontrado" });
    }

    res.json(driver);
  } catch (err) {
    console.error("Error buscando chofer:", err);
    res.status(500).json({ message: "Error buscando chofer" });
  }
};

// ----------------------------------------
// CREATE – Crear chofer
// ----------------------------------------
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

// ----------------------------------------
// UPDATE – Actualizar chofer
// ----------------------------------------
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

    // Validar licencia única
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

// ----------------------------------------
// DELETE – Eliminar chofer
// ----------------------------------------
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
