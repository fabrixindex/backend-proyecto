import { Router } from "express";
//import ProductManager from "../dao/productManager.js";
import productManagerMongodb from "../dao/productManager-mongodb.js";

const router = Router();
//const productM = new ProductManager("./products.json");

const productM_Mongo = new productManagerMongodb();

//GET PRODUCT BY ID

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    //const product = await productM.getProductById(Number(productId)); /*PRODUCT MANAGER (FS)*/

    const product = await productM_Mongo.getProductById(productId);

    if (product) {
      res.status(200).send({ status: "success", product });
    } else {
      res
        .status(404)
        .send({ status: "error", message: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error al obtener los productos" });
  }
});

//GET PRODUCT

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, category, available } = req.query;

    //const productos = await productM.getProduct(); /*PRODUCT MANAGER (FS)*/

    const baseUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl.split("?")[0]
    }`;

    const productos = await productM_Mongo.getAllproducts(
      limit,
      page,
      sort,
      category,
      available,
      baseUrl
    );

    res.send({ status: "success", products: productos });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error al obtener los productos" });
  }
});

//ADD PRODUCT

router.post("/new-product", async (req, res) => {
  try {
    const newProductData = req.body;

    const allProducts = await productM_Mongo.getAllproducts();
    const findCode = allProducts.products.find(
      (product) => product.code === newProductData.code
    );
    if (findCode) {
      return res.status(400).json({
        message: "El código del producto ya existe. No se puede repetir.",
      });
    }

    const newProduct = await productM_Mongo.createProduct(newProductData);

    //const result = await productM.addProduct /*PRODUCT MANAGER (FS)*/
    //const productos = await productM.getProduct(); /*PRODUCT MANAGER (FS)*/

    if (newProduct) {
      return res.status(201).json({
        message: "Producto agregado exitosamente",
        product: newProduct,
      });
    } else {
      return res.status(500).json({
        message: "Error al agregar el producto en la base de datos",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al agregar el producto",
      error: error.message,
    });
  }
});

//UPDATE PRODUCT

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedData = req.body;

    //const productToUpdate = await productM.getProductById(Number(productId)); /*PRODUCT MANAGER (FS)*/

    const productToUpdate = await productM_Mongo.getProductById(productId);

    if (!productToUpdate) {
      return res
        .status(404)
        .send({ status: "failed", message: "Producto no existente" });
    }

    //const result = await productM.updateProduct(Number(productId), updatedData); /*PRODUCT MANAGER (FS)*/

    const result = await productM_Mongo.updateProduct(productId, updatedData);

    res.status(200).send({ message: result.message, product: result.product });
  } catch (error) {
    res.status(500).send({ message: "Error al actualizar el producto" });
  }
});

//DELETE PRODUCT

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    //const result = await productM.deleteProduct(Number(productId)); /*PRODUCT MANAGER (FS)*/

    const result = await productM_Mongo.DeleteProductById(productId);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: false,
        message: "No se encontró el producto con el ID proporcionado",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Error al eliminar el producto",
      error: error.message,
    });
  }
});

export default router;
