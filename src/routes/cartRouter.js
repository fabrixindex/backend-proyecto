import { Router } from "express";
//import cartManager from "../dao/cartManager.js";
import cartManagerMongodb from "../dao/managers/cartManager-mongodb.js";

const cartRouter = Router();
//const cartM = new cartManager("./cart.json");

const cartM_Mongo = new cartManagerMongodb();

//ADD PRODUCT TO CART

cartRouter.post("/:cid/producto/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cartId = cid;
    const productId = pid;
    const quantity = req.body.quantity ? parseInt(req.body.quantity) : 1;

    const result = await cartM_Mongo.addProductToCart(
      cartId,
      productId,
      quantity
    );
    if (!result.success) {
      return res
        .status(404)
        .json({ status: "failed", message: result.message });
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al agregar el producto al carrito" });
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
    const newCart = await cartM_Mongo.addCart();
    res.status(200).send({ status: "success", cartId: newCart._id });
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

//DELETE A PRODUCT OF A CART

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cartId = cid;
    const productId = pid;

    const cartProd = await cartM_Mongo.removeProductFromCart(cartId, productId);

    if (cartProd.success) {
      res.status(200).json({
        status: "success",
        message: "Producto eliminado del carrito exitosamente.",
        cart: cartProd.finalCart,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No se pudo eliminar el producto del carrito.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Ocurrió un error al eliminar el producto del carrito.",
    });
  }
});

// EMPTY CART

cartRouter.delete("/:cid/emptycart/", async (req, res) => {
  try {
    const { cid } = req.params;

    const cartId = cid;

    const emptyCartResult = await cartM_Mongo.emptyCart(cartId);

    if (emptyCartResult.success) {
      res.status(200).json({
        status: "success",
        message: "Se eliminaron todos los productos del carrito exitosamente.",
        cart: emptyCartResult.finalCart,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No se pudo vaciar el carrito.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Ocurrió un error al vaciar el carrito.",
    });
  }
});

//UPDATE DATA CART

cartRouter.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    const response = await cartM_Mongo.UpdateDataCart(cartId, newProducts);

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error al actualizar los productos en el carrito:", error);
    res.status(500).json({
      success: false,
      message: "Ocurrió un error al actualizar los productos en el carrito.",
    });
  }
});

//UPDATE QUANTITY OF A PRODUCT WITHIN A CART

cartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cartId = cid;
    const productId = pid;

    const updateQuantityResult = await cartM_Mongo.updateQuantityOfProduct(
      cartId,
      productId,
      quantity
    );

    if (updateQuantityResult.success) {
      res.status(200).json({
        status: "success",
        message:
          "Se actualizó la cantidad del producto en el carrito exitosamente.",
        cart: updateQuantityResult.finalCart,
      });
    } else {
      res.status(404).json({
        status: "error",
        message:
          "No se pudo actualizar la cantidad del producto en el carrito.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message:
        "Ocurrió un error al actualizar la cantidad del producto en el carrito.",
    });
  }
});

export default cartRouter;
