import { fs } from "file-system";
import ProductManager from "./productManager.js";

const productM = new ProductManager("./products.json");

class cartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      await fs.promises
        .writeFile(this.path, "[]")
        .catch((err) => console.log(err));
      return [];
    }
  }

  async addCart(products = []) {
    try {
      const allCarts = await this.getCarts();

      const lastCartId =
        allCarts.length > 0 ? allCarts[allCarts.length - 1].id : 0;
      const id = lastCartId + 1;

      allCarts.push({
        id,
        products,
      });

      const cartString = JSON.stringify(allCarts, null, 2);
      await fs.promises.writeFile(this.path, cartString);
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const carts = await fs.promises.readFile(this.path, "utf-8");
      const allCarts = JSON.parse(carts);
      const cartSearchedById = allCarts.find((cart) => cart.id === id);

      if (!cartSearchedById) {
        return null;
      }

      return cartSearchedById;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) {
        console.log(`No se encontró el carrito con ID ${cartId}.`);
        return { success: false, message: "Cart not exist" };
      }

      const product = await productM.getProductById(productId);
      if (!product) {
        console.log(`No se encontró el producto con ID ${productId}.`);
        return { success: false, message: "Product not exist" };
      }

      const existingProduct = cart.products.find(
        (product) => product.id === productId
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ id: productId, quantity: 1 });
      }

      const allCarts = await this.getCarts();
      const updatedCarts = allCarts.map((c) => {
        if (c.id === cartId) {
          return cart;
        }
        return c;
      });

      const cartString = JSON.stringify(updatedCarts, null, 2);
      await fs.promises.writeFile(this.path, cartString);

      console.log(
        `Producto con ID ${productId} añadido al carrito con ID ${cartId}.`
      );
      return {
        success: true,
        message: "Producto añadido al carrito con éxito.",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Ocurrió un error al agregar el producto al carrito.",
      };
    }
  }
}

new cartManager("./cart.json");

export default cartManager;
