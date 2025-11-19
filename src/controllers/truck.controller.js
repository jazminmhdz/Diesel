// src/controllers/truck.controller.js
import Truck from "../models/Truck.js";

/** Obtener todos los camiones */
export const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find().populate("driverAssigned", "nombre numLicencia");
    res.json(trucks);
  } catch (err) {
    console.error("Error getAllTrucks:", err);
    res.status(500).json({ message: "Error obteniendo camiones" });
  }
};

/** Crear camión */
export const createTruck = async (req, res) => {
  try {
    const { economico, vin, marca, anio, platesMx, platesUsa, imageUrl } = req.body;

    if (!economico || !vin || !marca || !anio) {
      return res.status(400).json({ message: "economico, vin, marca y anio son obligatorios" });
    }

    // validaciones únicas
    if (await Truck.findOne({ economico })) {
      return res.status(409).json({ message: "El número económico ya está registrado" });
    }
    if (await Truck.findOne({ vin })) {
      return res.status(409).json({ message: "El VIN ya está registrado" });
    }

    const truck = await Truck.create({
      economico,
      vin,
      marca,
      anio: Number(anio),
      platesMx: platesMx || "",
      platesUsa: platesUsa || "",
      imageUrl: imageUrl || null,
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
    const update = { ...req.body };

    // validar únicos (excepto el mismo documento)
    if (update.economico) {
      const exists = await Truck.findOne({ economico: update.economico, _id: { $ne: id } });
      if (exists) return res.status(409).json({ message: "Otro camión ya tiene ese número económico" });
    }
    if (update.vin) {
      const exists = await Truck.findOne({ vin: update.vin, _id: { $ne: id } });
      if (exists) return res.status(409).json({ message: "Otro camión ya tiene ese VIN" });
    }

    if (update.anio) update.anio = Number(update.anio);

    const truck = await Truck.findByIdAndUpdate(id, update, { new: true });
    if (!truck) return res.status(404).json({ message: "Camión no encontrado" });

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
    if (!deleted) return res.status(404).json({ message: "Camión no encontrado" });
    res.json({ message: "Camión eliminado" });
  } catch (err) {
    console.error("Error deleteTruck:", err);
    res.status(500).json({ message: "Error eliminando camión" });
  }
};
