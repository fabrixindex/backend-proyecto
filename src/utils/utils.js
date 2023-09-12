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

// Middleware para validar el rol de "admin"
async function authorizationAdmin(req, res, next) {
  try {
    if (req.user && req.user.userRole === "admin") {
      return next();
    } else {
      return res
        .status(401)
        .json({ message: "Acceso no autorizado para administradores" });
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
      return res
        .status(401)
        .json({ message: "Acceso no autorizado para usuarios regulares" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Middleware para validar el rol de "user" o "admin" indistintamente
async function authorizationAdminOrUser(req, res, next) {
  try {
    if (
      req.user &&
      (req.user.userRole === "admin" || req.user.userRole === "user")
    ) {
      return next();
    } else {
      return res
        .status(401)
        .json({ message: "Acceso no autorizado para este recurso" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Middleware para validar el rol de "user" y para asegurar que el cid pertenezca a ese usuario
async function validateUserCart(req, res, next) {
  try {
    if (!req.user || req.user.userRole !== "user") {
      return res
        .status(401)
        .json({ message: "Acceso no autorizado para usuarios regulares" });
    }

    const userCart = req.user.cart;

    const cidFromRequest = req.params.cid;

    if (userCart.toString() !== cidFromRequest) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para modificar este carrito" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export {
  authorizationAdmin,
  authorizationUser,
  authorizationAdminOrUser,
  validateUserCart,
};
