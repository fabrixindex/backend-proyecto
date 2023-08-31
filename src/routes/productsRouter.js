import { Router } from "express";
import { getAllProductsController, getProductByIdController, createProductController, updateProductController, DeleteProductByIdController, getMockingProductsController } from "../controllers/products.controller.js";

const router = Router();

router.get("/:pid", getProductByIdController);

router.get('/mockingproducts', getMockingProductsController);

router.get("/", getAllProductsController);

router.post("/new-product", createProductController);

router.put("/:pid", updateProductController);

router.delete("/:pid", DeleteProductByIdController);

export default router;
