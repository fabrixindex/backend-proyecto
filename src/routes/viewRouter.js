import { Router } from "express";
import { register, login, profile, resetPassword, staticProducts, realtimeproducts, products, carts, webChat, restorePass, sendEmailToRestorePass, adminUpdateOrDeleteUser } from "../controllers/view.controller.js";
import { authorizationAdmin, validateToken } from "../utils/utils.js";

const viewRouter = Router();

/*------------------------------------------- PUBLIC AND PRIVATE ACCESS ----------------------------------------------------*/
const publicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/products");
  next();
};
const privateAccess = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  next();
};
/*--------------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------- LOGING ROUTES -------------------------------------------------------------*/
viewRouter.get("/register", publicAccess, register);
viewRouter.get("/login", publicAccess, login);
viewRouter.get("/profile", privateAccess, profile);
viewRouter.get("/resetPassword", publicAccess, resetPassword);
/*-------------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------- PRODUCTS ROUTES ------------------------------------------------------*/
viewRouter.get("/", privateAccess, staticProducts);
viewRouter.get("/realtimeproducts", privateAccess, realtimeproducts);
viewRouter.get("/products", privateAccess, products);
/*-------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------- CART ROUTES -----------------------------------------------------------*/
viewRouter.get("/cartsView/:cartId", privateAccess, carts);
/*-------------------------------------------------------------------------------------------------------------------------*/
viewRouter.get('/webchat', webChat);
/*-------------------------------------------------------------------------------------------------------------------------*/
viewRouter.get('/restore-pass/:email', validateToken, restorePass)

viewRouter.get('/emailToRestorePass', sendEmailToRestorePass)

viewRouter.get('/updateOrDeleteUser', authorizationAdmin, adminUpdateOrDeleteUser)

export default viewRouter;
