// src/app.js (BACKEND)
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// Rutas (asegúrate de que estos archivos existan exactamente con estos nombres)
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ----------------- Seguridad y middleware ----------------- */
app.use(helmet()); // cabeceras de seguridad

// CORS configurable desde .env (ALLOWED_ORIGINS)
// Valor esperado en .env: ALLOWED_ORIGINS=http://localhost:19006,https://mi-app.com
const allowedRaw = process.env.ALLOWED_ORIGINS || "*";
const allowedList = allowedRaw.split(",").map(s => s.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // origin === undefined para peticiones desde apps nativas / curl
      if (!origin) return callback(null, true);
      if (allowedList.includes("*") || allowedList.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked: origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Logger y parseo de body
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiter simple
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

/* ----------------- Archivos estáticos ----------------- */
// carpeta "uploads" para fotos/tickets. Crea la carpeta en la raíz del proyecto si no existe.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

/* ----------------- Rutas principales ----------------- */
app.use("/api/auth", authRoutes);     // login, /me
app.use("/api/admin", adminRoutes);   // endpoints de admin
app.use("/api/driver", driverRoutes); // endpoints de driver
app.use("/api/reports", reportsRoutes);// alertas / rendimiento

/* ----------------- Healthcheck ----------------- */
app.get("/api/health", (req, res) => res.json({ ok: true }));
// 🔍 DEBUG: Mostrar rutas cargadas
setTimeout(() => {
  console.log("✅ Rutas registradas:");
  const rutas = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      rutas.push(middleware.route.path);
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((r) => {
        const ruta = r.route?.path;
        if (ruta) rutas.push(ruta);
      });
    }
  });
  console.log(rutas);
}, 2000);


/* ----------------- Manejo de rutas no encontradas ----------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

/* ----------------- Manejador de errores central ----------------- */
app.use((err, req, res, next) => {
  console.error("💥 ERROR:", err.message || err);
  // JSON parse error
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "JSON inválido" });
  }
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Error interno del servidor" });
});
// === 🔍 DEBUG: Mostrar rutas activas registradas en Express ===
setTimeout(() => {
  console.log("✅ Rutas registradas en servidor:");
  const rutas = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      rutas.push(middleware.route.path);
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((r) => {
        const ruta = r.route?.path;
        if (ruta) rutas.push(ruta);
      });
    }
  });
  console.log(rutas);
}, 3000);


export default app;
