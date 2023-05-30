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

  async addProduct(
    title,
    description,
    price,
    thumbnails = [],
    code,
    stock,
    status = true,
    category
  ) {
    try {
      if (
        !title ||
        !description ||
        !price ||
        !code ||
        !stock ||
        !status ||
        !category
      )
        return `Todos los campos son obligatorios. El producto ${title} tiene un campo vacío!`;

      const allProducts = await this.getProduct();

      /*---------------------------- ASIGNAR ID AUTOINCREMENTABLE ----------------------------------------*/
      const lastProductId =
        allProducts.length > 0 ? allProducts[allProducts.length - 1].id : 0;
      const id = lastProductId + 1;

      /*--------------------------- EVITAR REPETICION DE PRODUCTOS ---------------------------------------*/
      const findCode = allProducts.find((product) => product?.code === code);
      if (findCode)
        return `El Codigo del producto ya existe. No se puede repetir!`;

      /*----------------------------- CONSTRUCCION DEL OBJETO --------------------------------------------*/
      allProducts.push({
        id,
        title,
        description,
        price,
        code,
        stock,
        status,
        category,
        thumbnails,
      });

      const productString = JSON.stringify(allProducts, null, 2);
      await fs.promises.writeFile(this.path, productString);
      return {
        message: "Producto añadido",
        product: allProducts[allProducts.length - 1],
      };
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
      const productToUpdate = await this.getProductById(id);

      if (!productToUpdate) {
        return `No se encontró el producto con ID ${id}.`;
      }

      const updatedProduct = { ...productToUpdate, ...updatedData };

      const allProducts = await this.getProduct();
      const updatedProducts = allProducts.map((product) => {
        if (product.id === id) {
          return updatedProduct;
        }
        return product;
      });

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(updatedProducts, null, 2),
        "utf-8"
      );

      return {
        message: `Se ha actualizado el producto con ID ${id}.`,
        product: updatedProduct,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      const allProducts = JSON.parse(products);
      const productSearchedById = allProducts.find(
        (product) => product.id === id
      );

      if (!productSearchedById) {
        return null;
      }
      return productSearchedById;
    } catch (error) {
      console.log(error);
    }
  }
}

new ProductManager("./products.json");
export default ProductManager;

/*--------------------------------------------- FIN DEL CODIGO --------------------------------------------------------*/
