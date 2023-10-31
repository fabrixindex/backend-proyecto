import { Router } from "express";
import { getAllProductsController, getProductByIdController, createProductController, updateProductController, DeleteProductByIdController, getMockingProductsController, sendProductImageController } from "../controllers/products.controller.js";
import { authorizationAdminOrUser, authorizationAdminOrPremium, allowPremiumToDeleteOwnProducts } from "../utils/utils.js";
import uploaderProductsFiles from "../utils/multerToProductsFiles.js";

const router = Router();

router.get('/mockingproducts', authorizationAdminOrUser, getMockingProductsController);

router.get("/:pid", authorizationAdminOrUser, getProductByIdController);

router.get("/", authorizationAdminOrUser, getAllProductsController);

router.post("/new-product", authorizationAdminOrPremium, createProductController);

router.put("/update/:pid", allowPremiumToDeleteOwnProducts, updateProductController);

router.delete("/delete/:pid", allowPremiumToDeleteOwnProducts, DeleteProductByIdController);

router.post("/sendProductImage/:pid", uploaderProductsFiles('products').array('products'), sendProductImageController);

export default router; 
