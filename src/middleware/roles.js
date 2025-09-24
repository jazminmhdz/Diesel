// src/middleware/roles.js
export function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
    }
    next();
  };
}
