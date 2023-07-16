import cartsModel from "../models/carts.models.js";
import productManagerMongodb from "../managers/productManager-mongodb.js";

const productManagerMdb = new productManagerMongodb();

class cartManagerMongodb {
  constructor() {
    this.cartsModel = cartsModel;
  }

  async addCart() {
    try {
      const newCart = await this.cartsModel.create({ products: [] });
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const cartData = await this.cartsModel.findById({ _id: id }).lean();

      if (!cartData) {
        throw new Error(`No se encontró el carrito con ID ${id}.`);
      }

      return cartData;
    } catch (error) {
      throw new Error("Ocurrió un error al obtener el carrito por ID.");
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.cartsModel.findById(cartId);

      if (!cart) {
        console.log(`No se encontró el carrito con ID ${cartId}.`);
        return { success: false, message: "Cart not exist" };
      }

      const product = await productManagerMdb.getProductById(productId);
      if (!product) {
        console.log(`No se encontró el producto con ID ${productId}.`);
        return { success: false, message: "Product not exist" };
      }

      const existingProduct = cart.products.find(
        (products) => products.productId._id.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ productId: productId, quantity: 1 });
      }

      const updatedCart = await cart.save();

      if (!updatedCart) {
        console.log(`Error al actualizar el carrito con ID ${cartId}.`);
        return { success: false, message: "Failed to update cart" };
      }

      console.log(
        `Producto con ID ${productId} añadido al carrito con ID ${cartId}.`
      );

      return {
        finalCart: updatedCart,
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

  async DeleteCartById(id) {
    try {
      const cartDeleted = await this.cartsModel.deleteOne({ _id: id });

      if (cartDeleted.deletedCount === 0) {
        return `No se encontró el carrito con ID ${id}.`;
      }

      return cartDeleted;
    } catch (error) {
      console.log(error);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.cartsModel.findById(cartId);

      if (!cart) {
        console.log(`No se encontró el carrito con ID ${cartId}.`);
        return { success: false, message: "El carrito no existe" };
      }

      const indexProducto = productManagerMdb.getProductById(productId);

      if (indexProducto === -1) {
        console.log(
          `No se encontró el producto con ID ${productId} en el carrito.`
        );
        return {
          success: false,
          message: "El producto no existe en el carrito",
        };
      }

      cart.products.splice(indexProducto, 1);

      const updatedCart = await this.cartsModel.findByIdAndUpdate(
        cartId,
        { products: cart.products },
        { new: true }
      );

      if (!updatedCart) {
        console.log(`Error al actualizar el carrito con ID ${cartId}.`);
        return { success: false, message: "Error al actualizar el carrito" };
      }

      console.log(
        `Producto con ID ${productId} eliminado del carrito con ID ${cartId}.`
      );

      return {
        finalCart: updatedCart,
        success: true,
        message: "Producto eliminado del carrito exitosamente.",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Ocurrió un error al eliminar el producto del carrito.",
      };
    }
  }

  async emptyCart(cartId) {
    try {
      const cart = await this.cartsModel.findById(cartId);

      if (!cart) {
        console.log(`No se encontró el carrito con ID ${cartId}.`);
        return { success: false, message: "El carrito no existe" };
      }

      cart.products = [];

      const updatedCart = await cart.save();

      if (!updatedCart) {
        console.log(`Error al actualizar el carrito con ID ${cartId}.`);
        return { success: false, message: "Error al actualizar el carrito" };
      }

      console.log(
        `Se eliminaron todos los productos del carrito con ID ${cartId}.`
      );

      return {
        finalCart: updatedCart,
        success: true,
        message: "Se eliminaron todos los productos del carrito exitosamente.",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Ocurrió un error al eliminar los productos del carrito.",
      };
    }
  }

  async UpdateDataCart(cartId, products) {
    try {
      const cart = await this.cartsModel.findById(cartId);

      if (!cart) {
        console.log(`No se encontró el carrito con ID ${cartId}.`);
        return { success: false, message: "El carrito no existe" };
      }

      cart.products = products;

      const updatedCart = await cart.save();

      if (!updatedCart) {
        console.log(`Error al actualizar el carrito con ID ${cartId}.`);
        return { success: false, message: "Error al actualizar el carrito" };
      }

      console.log(`Productos actualizados en el carrito con ID ${cartId}.`);

      return {
        finalCart: updatedCart,
        success: true,
        message: "Productos actualizados en el carrito exitosamente.",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Ocurrió un error al actualizar los productos en el carrito.",
      };
    }
  }

  async updateQuantityOfProduct(cartId, productId, quantity) {
    try {
      const cart = await this.cartsModel.findById(cartId);
      if (!cart) {
        console.log(`No se encontró el carrito con ID ${cartId}.`);
        return { success: false, message: "El carrito no existe" };
      }

      const existingProduct = cart.products.find(
        (products) => products.productId._id.toString() === productId
      );
      if (!existingProduct) {
        throw new Error("Producto no encontrado en el carrito");
      }
      if (!quantity) {
        throw new Error("Ingresar el valor quantity es obligatorio!");
      }
      if (quantity <= 0) {
        throw new Error("Quantity no puede ser 0 o un número negativo!");
      }
      existingProduct.quantity = quantity;

      const updatedCart = await cart.save();

      if (!updatedCart) {
        console.log(`Error al actualizar el carrito con ID ${cartId}.`);
        return { success: false, message: "Error al actualizar el carrito" };
      }

      console.log(
        `Se actualizó la cantidad del producto con ID ${productId} en el carrito con ID ${cartId}.`
      );

      return {
        finalCart: updatedCart,
        success: true,
        message:
          "Se actualizó la cantidad del producto en el carrito exitosamente.",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message:
          "Ocurrió un error al actualizar la cantidad del producto en el carrito.",
      };
    }
  }
}

export default cartManagerMongodb;
