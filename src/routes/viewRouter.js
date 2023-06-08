import { Router } from "express";
import ProductManager from "../productManager.js";
import { Server } from "socket.io";

const viewRouter = Router();
const productM = new ProductManager("./products.json");
const socketServer = new Server();

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
  
      socketServer.emit("productsUpdated", products);
    } catch (error) {
      res
        .status(500)
        .send({ status: "error", message: "Error al obtener los productos" });
    }
  });

export default viewRouter;
