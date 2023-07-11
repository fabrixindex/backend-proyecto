import { Router } from "express";
//import ProductManager from "../dao/productManager.js";
import productManagerMongodb from "../dao/productManager-mongodb.js";
import cartManagerMongodb from "../dao/cartManager-mongodb.js";
import productsModels from "../dao/models/products.models.js";

const viewRouter = Router();
const productM = new productManagerMongodb
const cartM = new cartManagerMongodb

viewRouter.get("/", async (req, res) => {
    try {
      const products = await productM.getAllproducts();
      res.render("home", { products: products });
    } catch (error) {
      res.status(500).send({ status: "error", message: "Error al obtener los productos" });
    }
  });

  viewRouter.get("/realtimeproducts", async (req, res) => {
    try {
      const products = await productM.getAllproduct();
      res.render("realTimeProducts", { products });
    } catch (error) {
      res
        .status(500)
        .send({ status: "error", message: "Error al obtener los productos" });
    }
  });

  viewRouter.get("/products", async (req, res) => {
    try {
      const { limit = 10, page = 1, sort, category, available} = req.query;
      const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
      const products = await productM.getAllproducts(limit, page, sort, category, available, baseUrl)
      
      res.render("home", { products: products });
    }catch(error){
      res
        .status(500)
        .send({ status: "error", message: "Error al obtener los productos" });
    }
  });

  viewRouter.get("/cartsView/:cartId", async (req, res) => {
    try{
      const cartId = req.params.cartId;
      const cart = await cartM.getCartById(cartId)
      res.render('cart', {cart: cart})
    }catch(error){
      res
      .status(500)
      .send({ status: "error", message: "Error al obtener el carrito" });
    }
  });


export default viewRouter;
