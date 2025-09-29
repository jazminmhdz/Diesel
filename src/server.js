// src/server.js
import "dotenv/config"; // carga variables de entorno automáticamente
import app from "./app.js";
import connect from "./db.js";

const PORT = process.env.PORT || 4000;

// Conectar a MongoDB y arrancar servidor
connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 API escuchando en :${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Fallo al conectar MongoDB", err);
    process.exit(1);
  });
