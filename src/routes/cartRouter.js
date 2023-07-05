import { Router } from "express";
//import cartManager from "../dao/cartManager.js";
import cartManagerMongodb from "../dao/cartManager-mongodb.js";

const cartRouter = Router();
//const cartM = new cartManager("./cart.json");

const cartM_Mongo = new cartManagerMongodb

//ADD PRODUCT TO CART

cartRouter.post("/:cid/producto/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cartId = cid;
    const productId = pid;
    const quantity = req.body.quantity ? parseInt(req.body.quantity) : 1;

    const result = await cartM_Mongo.addProductToCart(cartId, productId, quantity);
    if (!result.success) {
      return res.status(404).json({ status: "failed", message: result.message });
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ocurrió un error al agregar el producto al carrito" });
  }
});

//GET CART

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartM_Mongo.getCartById(cartId);

    if (cart) {
      res.status(200).send({ status: "success", cart });
    } else {
      res
        .status(404)
        .send({ status: "error", message: "Carrito no encontrado." });
    }
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error al obtener el carrito." });
  }
});

//NEW CART

cartRouter.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    const result = await cartM_Mongo.addCart(products);

    res.status(200).send({ status: "success", result });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", payload: "Error al agregar el carrito" });
  }
});

//DELETE CART 

cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const result = await cartM_Mongo.DeleteCartById(cartId);


    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: false,
        message: "No se encontró el carrito con el ID proporcionado",
      });
    }

    return res.status(200).json({
      status: true,
      message: "carrito eliminado exitosamente",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Error al eliminar el carrito",
      error: error.message,
    });
  }
});

export default cartRouter;
