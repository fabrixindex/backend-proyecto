import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { productsService } from "../services/products.service.js";
import jwt from 'jsonwebtoken';
import variables from "../config/dotenv.config.js"

const PRIVATE_KEY = variables.PRIVATE_key;

const ProductsService = new productsService()

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
    if (req.user && (req.user.userRole === "user" || req.user.userRole === "premium")) {
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
      (req.user.userRole === "admin" || req.user.userRole === "user" || req.user.userRole === "premium")
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
    if (!req.user || (req.user.userRole !== "user" && req.user.userRole !== "premium")) {
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
};

// Middleware para validar el rol de "Premium" o "admin" indistintamente
async function authorizationAdminOrPremium(req, res, next) {
  try {
    if (
      req.user &&
      (req.user.userRole === "admin" || req.user.userRole === "premium")
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
};

// Middleware para validar el usuario sea "premium" para eliminar o modificar su propio producto o admin
async function allowPremiumToDeleteOwnProducts(req, res, next) {
  try {
    const userRole = req.user.userRole; 
    const productId = req.params.pid; 

    if (userRole === "premium" || userRole === "admin") {
    
      if (userRole === "admin") {
        return next();
      }

      const product = await ProductsService.getProductById(productId);
      const { email } = req.session.user;

      const firstProduct = product[0]; 
      const owner = firstProduct.owner; 

      if (owner === email) {
        return next();
      }
    }

    return res
      .status(401)
      .json({ message: "Acceso no autorizado para borrar este producto" });

  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//Middleware para validad que el usuario sea premiun y que no pueda agregar un producto del que es owner

const checkUserRoleIsPremium = async (req, res, next) => {
  try {
    const userRole = req.user.userRole; 
    const productId = req.params.pid;

    if (userRole === 'premium') {
      const product = await ProductsService.getProductById(productId);

      const userEmail = req.user.email; 

      const productArray = product[0]; 
      const owner = productArray.owner; 

      if (owner === userEmail) {
        return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito.' });
      }
    }

    return next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en la verificación de rol de usuario' });
  }
};

//Middleware para validar token

async function validateToken(req, res, next) {
  try{
    const token = req.params.email;
    jwt.verify(token, PRIVATE_KEY);
    const data = jwt.decode(token); 

    req.email = data.email;
    req.token = token
    next()
  }catch(error){
    
    if (error.message === 'jwt expired') {
      return res.redirect('http://localhost:8080/emailToRestorePass');
    }

    return res.send(`Hubo un error al intentar recuperar password: ${error.message}`)
  }
} 

export {
  authorizationAdmin,
  authorizationUser,
  authorizationAdminOrUser,
  authorizationAdminOrPremium,
  validateUserCart,
  allowPremiumToDeleteOwnProducts,
  checkUserRoleIsPremium,  
  validateToken
};
