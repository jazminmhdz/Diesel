// src/seedAdmin.js
import 'dotenv/config';
import connect from './db.js';         // usa tu helper de conexión si existe
import User from './models/User.js';
import bcrypt from 'bcrypt';

(async () => {
  try {
    await connect(process.env.MONGO_URI);
    const email = 'admin@diesel.local';

    // Elimina cualquier usuario anterior con ese email (para evitar conflicto de schema)
    await User.deleteOne({ email });

    const plain = 'Admin123!'; // contraseña que usarás en Postman
    const passwordHash = await bcrypt.hash(plain, 10);

    const admin = await User.create({
      email,
      password: passwordHash,   // <- guarda en el campo 'password' (coincide con tu modelo actual)
      role: 'admin'
    });

    console.log('✅ Admin creado:', admin.email);
    process.exit(0);
  } catch (e) {
    console.error('❌ Error creando admin:', e);
    process.exit(1);
  }
})();
