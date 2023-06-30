import { Router } from "express";
//import ProductManager from "../dao/productManager.js";
import socketServer  from "../app.js";
import productManagerMongodb from "../dao/productManager-mongodb.js";

const router = Router();
//const productM = new ProductManager("./products.json");

const productM_Mongo = new productManagerMongodb

//GET PRODUCT BY ID

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    
    //const product = await productM.getProductById(Number(productId)); /*PRODUCT MANAGER (FS)*/

    const product = await productM_Mongo.getProductById(Number(productId));

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

    const productos = await productM_Mongo.getAllproducts();
    s
    socketServer.emit("emmit-products", productos);

    res.status(200).send({ message: result.message, product: result.product });
  } catch (error) {
    res.status(500).send({ message: "Error al agregar el producto" });
  }
});

//UPDATE PRODUCT

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedData = req.body;

    //const productToUpdate = await productM.getProductById(Number(productId)); /*PRODUCT MANAGER (FS)*/

    const productToUpdate = await productM_Mongo.getProductById(Number(productId));

    if (!productToUpdate) {
      return res
        .status(404)
        .send({ status: "failed", message: "Producto no existente" });
    }

    //const result = await productM.updateProduct(Number(productId), updatedData); /*PRODUCT MANAGER (FS)*/

    const result = await productM_Mongo.updateProduct(Number(productId), updatedData);

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

    const result = await productM_Mongo.DeleteProductById(Number(productId))

    res.status(200).send({ status: true, message: result });
  } catch (error) {
    res
      .status(500)
      .send({ status: false, message: "Error al eliminar el producto" });
  }
});

export default router;
