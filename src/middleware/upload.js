// src/middleware/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// 📁 Compatibilidad con __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📦 Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "");
    cb(null, Date.now() + "-" + cleanName);
  },
});

// ✅ Filtro para solo permitir imágenes
function fileFilter(req, file, cb) {
  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
    return cb(new Error("Formato de imagen no permitido"), false);
  }
  cb(null, true);
}

// 💾 Exporta correctamente como "default" (necesario para tu import en admin.routes.js)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB máximo
});

export default upload;
