import { fs } from "file-system";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProduct() {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      console.log("No existe el archivo. Creando...");
      await fs.promises
        .writeFile(this.path, "[]")
        .catch((err) => console.log(err));
      return [];
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock 
      )
        return `Todos los campos son obligatorios. El producto ${title} tiene un campo vacío!`;

      const allProducts = await this.getProduct();

      /*---------------------------- ASIGNAR ID AUTOINCREMENTABLE ----------------------------------------*/
      const lastProductId = allProducts.length > 0 ? allProducts[allProducts.length - 1].id : 0;
      const id = lastProductId + 1;

      /*--------------------------- EVITAR REPETICION DE PRODUCTOS ---------------------------------------*/
      const findCode = allProducts.find((product) => product?.code === code);
      if (findCode) return `El Codigo del producto ya existe. No se puede repetir!`;
      
      /*----------------------------- CONSTRUCCION DEL OBJETO --------------------------------------------*/
      allProducts.push({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id,
      });

      const productString = JSON.stringify(allProducts, null, 2);
      await fs.promises.writeFile(this.path, productString);
      return `Producto añadido!`;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const allProducts = await this.getProduct();

      const productoParaEliminar = allProducts.findIndex(
        (product) => product.id === id
      );

      if (productoParaEliminar === -1) {
        return `No se encontró el producto con ID ${id}.`;
      }

      allProducts.splice(productoParaEliminar, 1);

      const productString = JSON.stringify(allProducts, null, 2);
      await fs.promises.writeFile(this.path, productString);

      return `Producto con ID N° ${id} ha sido eliminado correctamente.`;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, updatedData) {
    try {
      const allProducts = await this.getProduct();

      const producToUpdate = allProducts.findIndex(
        (product) => product.id === id
      );

      if (producToUpdate === -1) {
        return `No se encontró el producto con ID ${id}.`;
      }

      const updatedProduct = { ...allProducts[producToUpdate], ...updatedData };
      allProducts[producToUpdate] = updatedProduct;

      const productString = JSON.stringify(allProducts, null, 2);
      await fs.promises.writeFile(this.path, productString);

      return `Producto con ID ${id} actualizado correctamente.`;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try{
      const products = await fs.promises.readFile(this.path, "utf-8");
      const allProducts = JSON.parse(products);
      const productSearchedById = allProducts.find(product => product.id === id);

      if (!productSearchedById) {
        return null;
      }
      return productSearchedById;
    }catch(error) {
      console.log(error);
    }
  }
}

/*---------------------------------------------- EJECUCION DEL PROGRAMA -----------------------------------------------------*/

const manager = new ProductManager("./products.json");
async function main() {

  /*---------------------------------------------- MOSTRAR PRODUCTOS -----------------------------------------------------*/

  const allProducts = await manager.getProduct();
  console.log("Listado de productos:", allProducts);

  /*----------------------------------------------- AÑADIR PRODUCTO  -----------------------------------------------------*/

  const product1 = await manager.addProduct(
    "Soy el producto 1",
    "Soy un producto de excelente calidad y muy vendido",
    100,
    "no tengo foto :C",
    12345,
    10
  );

  const product2 = await manager.addProduct(
    "Soy el producto 2",
    "Soy un producto bueno",
    50,
    "no tengo foto :C",
    54321,
    5
  );

  const product3 = await manager.addProduct(
    "Soy el producto 3",
    "Soy un producto muy económico pero bueno",
    25,
    "no tengo foto :C",
    56789,
    2
  );

  console.log({ product1 });
  console.log({ product2 });
  console.log({ product3 });

  /*----------------------------------------- BORRAR PRODUCTO EXISTENTE -----------------------------------------------------*/

  const deleteResult = await manager.deleteProduct(/*3*/);
  console.log(deleteResult);

  /*----------------------------------------- BUSCAR PRODUCTO EXISTENTE -----------------------------------------------------*/

  const searchProduct = await manager.getProductById(/*1*/);
  console.log("El producto ha sido encontrado! Producto:", searchProduct);

  /*-------------------------------------- ACTUALIZAR PRODUCTO EXISTENTE ----------------------------------------------------*/

  const updateProductResult = await manager.updateProduct(2, {
    title: "Producto 2 Actualizado",
    description: "Descripción actualizada",
    price: 75,
    thumbnail: "nueva_foto.jpg",
    code: 54321,
    stock: 8,
  });

  console.log(updateProductResult);

  const updatedProducts = await manager.getProduct();
  console.log(updatedProducts);

  /*----------------------------------------------------------------------------------------------------------------------*/
}
main();

export default ProductManager;

/*------------------------------------------------ FIN DEL CODIGO -----------------------------------------------------------*/