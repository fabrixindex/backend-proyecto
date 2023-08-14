import { Router } from "express";
import { addCartController, getCartByIdController, addProductToCartController, DeleteCartByIdController, removeProductFromCartController, emptyCartController, UpdateDataCartController, updateQuantityOfProductController } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/:cid/producto/:pid", addProductToCartController);

cartRouter.get("/:cid", getCartByIdController);

cartRouter.post("/", addCartController);

cartRouter.delete("/:cid", DeleteCartByIdController);

cartRouter.delete("/:cid/product/:pid", removeProductFromCartController);

cartRouter.delete("/:cid/emptycart/", emptyCartController);

cartRouter.put("/:cid", UpdateDataCartController);

cartRouter.put("/:cid/product/:pid", updateQuantityOfProductController);

export default cartRouter;
