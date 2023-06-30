import { Router } from "express";
import ProductManager from "../dao/productManager.js";

const viewRouter = Router();
const productM = new ProductManager("./products.json");

viewRouter.get("/", async (req, res) => {
    try {
      const productos = await productM.getProduct();
      res.render("home", { products: productos });
    } catch (error) {
      res.status(500).send({ status: "error", message: "Error al obtener los productos" });
    }
  });

  viewRouter.get("/realtimeproducts", async (req, res) => {
    try {
      const products = await productM.getProduct();
      res.render("realTimeProducts", { products });
    } catch (error) {
      res
        .status(500)
        .send({ status: "error", message: "Error al obtener los productos" });
    }
  });

  viewRouter.get("/chat", async (req, res) => {
    try{
      res.render("chat")
    } catch(error){
      res
      .status(500)
      .send({ status: "error", message: "Error al obtener chat"})
    }
  })

export default viewRouter;
