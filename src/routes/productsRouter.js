import { Router } from "express";
import { getAllProductsController, getProductByIdController, createProductController, updateProductController, DeleteProductByIdController, getMockingProductsController } from "../controllers/products.controller.js";
import { authorizationAdminOrUser, authorizationAdminOrPremium, allowPremiumToDeleteOwnProducts } from "../utils/utils.js";

const router = Router();

router.get('/mockingproducts', authorizationAdminOrUser, getMockingProductsController);

router.get("/:pid", authorizationAdminOrUser, getProductByIdController);

router.get("/", authorizationAdminOrUser, getAllProductsController);

router.post("/new-product", authorizationAdminOrPremium, createProductController);

router.put("/:pid", allowPremiumToDeleteOwnProducts, updateProductController);

router.delete("/:pid", allowPremiumToDeleteOwnProducts, DeleteProductByIdController);

export default router;
