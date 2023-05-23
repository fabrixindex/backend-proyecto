import express from "express";
import ProductManager from "./productManager.js";

const app = express();
const productM = new ProductManager("./products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/productos/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const producto = await productM.getProduct();

    if (productId) {
      const filteredProduct = producto.find((p) => p.id === Number(productId));
      if (filteredProduct) {
        res.send(filteredProduct);
      } else {
        res.status(404).send({ message: "Producto no encontrado" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "Error al obtener los productos" });
  }
}); //EJEMPLO: http://localhost:8080/productos/3

app.get("/productos", async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await productM.getProduct();

    if (limit && !isNaN(limit)) {
      const limitedProducts = productos.slice(0, Number(limit));
      res.send(limitedProducts);
    } else {
      res.send(productos);
    }
  } catch (error) {
    res.status(500).send({ message: "Error al obtener los productos" });
  }
}); //EJEMPLO: http://localhost:8080/productos?limit=1

app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});
