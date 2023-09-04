import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

export default __dirname;

// validar que el usuario tenga el rol de administrador mediante un middleware

// Middleware para validar el rol de "admin"
async function authorizationAdmin(req, res, next) {
  try {
    if (req.user && req.user.userRole === "admin") {
      
      return next();
    } else {
      
      return res.status(401).json({ message: "Acceso no autorizado para administradores" });
    }
  } catch (error) {
    
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Middleware para validar el rol de "user"
async function authorizationUser(req, res, next) {
  try {
    if (req.user && req.user.userRole === "user") {
      
      return next();
    } else {
      
      return res.status(401).json({ message: "Acceso no autorizado para usuarios regulares" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Middleware para validar el rol de "user" o "admin" indistintamente
async function authorizationAdminOrUser(req, res, next) {
  try {
    if (req.user && (req.user.userRole === "admin" || req.user.userRole === "user")) {
      return next();
    } else {
      
      return res.status(401).json({ message: "Acceso no autorizado para este recurso" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export { authorizationAdmin, authorizationUser, authorizationAdminOrUser };


