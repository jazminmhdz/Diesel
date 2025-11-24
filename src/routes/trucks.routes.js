import express from "express";
import multer from "multer";
import Truck from "../models/Truck.js";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/roles.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// GET - Listar todos los camiones
router.get("/", async (req, res) => {
  try {
    const trucks = await Truck.find();
    res.json(trucks);
  } catch (err) {
    console.error("GET /trucks error:", err);
    res.status(500).json({ message: "Error cargando camiones" });
  }
});

// POST - Crear camión
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      economicNumber,
      vin,
      brand,
      year,
      platesMx,
      platesUsa,
      image
    } = req.body;

    if (!economicNumber || !vin || !brand || !year || !platesMx) {
      return res.status(400).json({
        message:
          "economicNumber, vin, brand, year y platesMx son obligatorios"
      });
    }

    const newTruck = new Truck({
      economicNumber,
      vin,
      brand,
      year,
      platesMx,
      platesUsa: platesUsa || null,
      image: image || ""
    });

    await newTruck.save();

    res.status(201).json({
      message: "Camión creado correctamente",
      truck: newTruck
    });
  } catch (err) {
    console.error("POST /trucks error:", err);
    res.status(500).json({ message: "Error creando camión" });
  }
});




// PUT - Editar camión
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const truck = await Truck.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json(truck);
  } catch (err) {
    console.error("PUT /trucks/:id error:", err);
    res.status(500).json({ message: "Error editando camión" });
  }
});

export default router;
