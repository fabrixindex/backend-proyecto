import { Router } from "express";
import { addCartController, getCartByIdController, addProductToCartController, DeleteCartByIdController, removeProductFromCartController, emptyCartController, UpdateDataCartController, updateQuantityOfProductController, checkoutCartController } from "../controllers/cart.controller.js";
import { authorizationUser, authorizationAdmin, authorizationAdminOrUser, validateUserCart, checkUserRoleIsPremium } from "../utils/utils.js";

const cartRouter = Router();

cartRouter.post("/:cid/producto/:pid", validateUserCart, checkUserRoleIsPremium, addProductToCartController);

cartRouter.get("/:cid", authorizationAdminOrUser, getCartByIdController);

cartRouter.post("/", authorizationUser, addCartController);

cartRouter.delete("/delete/:cid", authorizationAdmin, DeleteCartByIdController);

cartRouter.delete("/:cid/product/:pid", authorizationUser, removeProductFromCartController);

cartRouter.delete("/:cid/emptycart/", authorizationUser, emptyCartController);

cartRouter.put("/update/:cid", authorizationUser, UpdateDataCartController);

cartRouter.put("/:cid/productquantity/:pid", authorizationUser, updateQuantityOfProductController);

cartRouter.post("/:cid/checkout", authorizationUser, checkoutCartController);

export default cartRouter;
