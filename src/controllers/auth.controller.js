import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// 🔑 Clave secreta para el token (usa variable de entorno si existe)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ⏰ Tiempo de expiración del token
const TOKEN_EXPIRATION = "7d";

// ==================================================
// 📌 LOGIN
// ==================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña requeridos" });

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// ==================================================
// 📌 OBTENER USUARIO ACTUAL
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
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ==================================================
// 📌 REGISTRAR ADMINISTRADOR (solo una vez)
// ==================================================
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Faltan campos obligatorios" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "El correo ya está registrado" });

    // Encriptar contraseña
    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashed,
      role: "admin",
    });

    await newUser.save();
    res.status(201).json({ message: "Administrador registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar admin:", error.message);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
