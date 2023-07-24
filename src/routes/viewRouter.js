import { Router } from "express";
//import ProductManager from "../dao/productManager.js";
import productManagerMongodb from "../dao/managers/productManager-mongodb.js";
import cartManagerMongodb from "../dao/managers/cartManager-mongodb.js";

const viewRouter = Router();
const productM = new productManagerMongodb();
const cartM = new cartManagerMongodb();

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

viewRouter.get("/register", publicAccess, async (req, res) => {
  res.render("register");
});

viewRouter.get("/login", publicAccess, async (req, res) => {
  res.render("login");
});

viewRouter.get("/profile", async (req, res) => {
  const isAdmin = req.session.user.role === 'admin';
  
  res.render("profile", {
    user: req.session.user,
    isAdmin: isAdmin
  }); 
});

viewRouter.get("/resetPassword", async (req,res) => {
  res.render("resetPassword")
});

/*-------------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------- PRODUCTS ROUTES ------------------------------------------------------*/
viewRouter.get("/", privateAccess, async (req, res) => {
  try {
    const products = await productM.getAllproducts();
    res.render("home", { products: products });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error al obtener los productos" });
  }
});

viewRouter.get("/realtimeproducts", privateAccess, async (req, res) => {
  try {
    const products = await productM.getAllproduct();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error al obtener los productos" });
  }
});

viewRouter.get("/products", privateAccess, async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, category, available } = req.query;
    const baseUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl.split("?")[0]
    }`;
    const isAdmin = req.session.user.role === 'admin';

    const products = await productM.getAllproducts(
      limit,
      page,
      sort,
      category,
      available,
      baseUrl
    );

    res.render("home", { products: products, user: req.session.user, isAdmin: isAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message:
        "Error al obtener los productos. Por favor, inténtelo de nuevo más tarde.",
    });
  }
});

/*-------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------- CART ROUTES -----------------------------------------------------------*/

viewRouter.get("/cartsView/:cartId", privateAccess, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await cartM.getCartById(cartId);
    res.render("cart", { cart: cart });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error al obtener el carrito" });
  }
});
/*-------------------------------------------------------------------------------------------------------------------------*/

export default viewRouter;
