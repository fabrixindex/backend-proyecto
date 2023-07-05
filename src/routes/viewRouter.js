import { Router } from "express";
//import ProductManager from "../dao/productManager.js";
import productManagerMongodb from "../dao/productManager-mongodb.js";

const viewRouter = Router();
const productM = new productManagerMongodb

viewRouter.get("/", async (req, res) => {
    try {
      const productos = await productM.getAllproducts();
      res.render("home", { products: productos });
    } catch (error) {
      res.status(500).send({ status: "error", message: "Error al obtener los productos" });
    }
  });

  viewRouter.get("/realtimeproducts", async (req, res) => {
    try {
      const products = await productM.getAllproducts();
      res.render("realTimeProducts", { products });
    } catch (error) {
      res
        .status(500)
        .send({ status: "error", message: "Error al obtener los productos" });
    }
  });


export default viewRouter;
