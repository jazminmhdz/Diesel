import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const TOKEN_EXPIRATION = "7d";

// ==================================================
// 📌 LOGIN (solo administrador)
// ==================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña requeridos" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    if (user.role !== "admin")
      return res.status(403).json({ message: "Acceso denegado. Solo administradores" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.json({
      message: "Inicio de sesión exitoso ✅",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ==================================================
// 📌 OBTENER PERFIL DEL USUARIO ACTUAL
// ==================================================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Error en getMe:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ==================================================
// 📌 REGISTRAR ADMINISTRADOR (una sola vez)
// ==================================================
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "El correo ya está registrado" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashed,
      role: "admin",
    });

    await newUser.save();
    res.status(201).json({ message: "Administrador registrado correctamente ✅" });
  } catch (error) {
    console.error("❌ Error al registrar admin:", error.message);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ==================================================
// 📌 TEST ROUTE
// ==================================================
export const testConnection = (req, res) => {
  res.json({
    message: "✅ API de autenticación activa y funcional",
    serverTime: new Date().toLocaleString(),
  });
};
