// src/controllers/trucks.controller.js
import Truck from "../models/Truck.js";

/** Obtener todos los camiones */
export const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find()
      .populate("driverAssigned", "nombre numLicencia");

    res.json(trucks);
  } catch (err) {
    console.error("Error getAllTrucks:", err);
    res.status(500).json({ message: "Error obteniendo camiones" });
  }
};

/** Obtener camión por ID */
export const getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id)
      .populate("driverAssigned", "nombre numLicencia");

    if (!truck)
      return res.status(404).json({ message: "Camión no encontrado" });

    res.json(truck);
  } catch (err) {
    console.error("Error getTruckById:", err);
    res.status(500).json({ message: "Error obteniendo camión" });
  }
};

/** Crear camión */
export const createTruck = async (req, res) => {
  try {
    const {
      serialNumber,
      economicNumber,
      vin,
      brand,
      model,
      year,
      platesMx,
      platesUsa,
      driverAssigned,
      imageUrl
    } = req.body;

    // Validación correcta según tu modelo REAL
    if (!economicNumber || !vin || !brand || !model || !year) {
      return res.status(400).json({
        message: "economicNumber, vin, brand, model y year son obligatorios"
      });
    }

    // Validar unicidad
    if (await Truck.findOne({ economicNumber }))
      return res.status(409).json({ message: "El número económico ya existe" });

    if (await Truck.findOne({ vin }))
      return res.status(409).json({ message: "El VIN ya existe" });

    // Crear camión
    const truck = await Truck.create({
      serialNumber: serialNumber || "",
      economicNumber,
      vin,
      brand,
      model,
      year: Number(year),
      platesMx: platesMx || "",
      platesUsa: platesUsa || null,
      driverAssigned: driverAssigned || null,
      imageUrl: imageUrl || ""
    });

    res.status(201).json(truck);
  } catch (err) {
    console.error("Error createTruck:", err);
    res.status(500).json({ message: "Error creando camión" });
  }
};

/** Actualizar camión */
export const updateTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.year) updates.year = Number(updates.year);

    // Validación unicidad
    if (updates.economicNumber) {
      const repeated = await Truck.findOne({
        economicNumber: updates.economicNumber,
        _id: { $ne: id }
      });
      if (repeated)
        return res.status(409).json({ message: "Otro camión ya tiene ese número económico" });
    }

    if (updates.vin) {
      const repeated = await Truck.findOne({
        vin: updates.vin,
        _id: { $ne: id }
      });
      if (repeated)
        return res.status(409).json({ message: "Otro camión ya tiene ese VIN" });
    }

    const truck = await Truck.findByIdAndUpdate(id, updates, { new: true });

    if (!truck)
      return res.status(404).json({ message: "Camión no encontrado" });

    res.json(truck);
  } catch (err) {
    console.error("Error updateTruck:", err);
    res.status(500).json({ message: "Error actualizando camión" });
  }
};

/** Eliminar camión */
export const deleteTruck = async (req, res) => {
  try {
    const deleted = await Truck.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Camión no encontrado" });

    res.json({ message: "Camión eliminado" });
  } catch (err) {
    console.error("Error deleteTruck:", err);
    res.status(500).json({ message: "Error eliminando camión" });
  }
};
