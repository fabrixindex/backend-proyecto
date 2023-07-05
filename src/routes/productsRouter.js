import { Router } from "express";
//import ProductManager from "../dao/productManager.js";
import productManagerMongodb from "../dao/productManager-mongodb.js";

const router = Router();
//const productM = new ProductManager("./products.json");

const productM_Mongo = new productManagerMongodb

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
    const limit = req.query.limit;
    //const productos = await productM.getProduct(); /*PRODUCT MANAGER (FS)*/

    const productos = await productM_Mongo.getAllproducts();

    if (limit && !isNaN(limit)) {
      const limitedProducts = productos.slice(0, Number(limit));
      res.status(200).send({ status: "success", limitedProducts });
    } else {
      res.status(200).send({ status: "success", productos });
    }
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error al obtener los productos" });
  }
});

//ADD PRODUCT

router.post("/new-product", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
      category,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category
    ) {
      return res
        .status(400)
        .send({
          message: `Todos los campos son obligatorios. El producto tiene un campo vacío!`,
          error: `missing fields`,
        });
    }

    //const result = await productM.addProduct /*PRODUCT MANAGER (FS)*/
    
    const result = await productM_Mongo.createProduct(
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
      category
    );

    //const productos = await productM.getProduct(); /*PRODUCT MANAGER (FS)*/

    if (result) {
      return res.status(200).json({
        message: "Producto agregado!",
        product: result,
      });
    } else {
      return res.status(500).json({
        message: "Error al agregar el producto",
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
