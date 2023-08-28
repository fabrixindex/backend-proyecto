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
      return cartData;
    } catch (error) {
      throw new Error("Ocurrió un error al obtener el carrito por ID.");
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.cartsModel.findById(cartId);

      const product = await productManagerMdb.getProductById(productId);


      const existingProduct = cart.products.find(
        (products) => products.productId._id.toString() === productId
      );

      const updatedCart = await cart.save();

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
      return cartDeleted;
    } catch (error) {
      console.log(error);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.cartsModel.findById(cartId);

      const indexProducto = productManagerMdb.getProductById(productId);

      cart.products.splice(indexProducto, 1);

      const updatedCart = await this.cartsModel.findByIdAndUpdate(
        cartId,
        { products: cart.products },
        { new: true }
      );

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

      cart.products = [];

      const updatedCart = await cart.save();

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

      cart.products = products;

      const updatedCart = await cart.save();

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

      const existingProduct = cart.products.find(
        (products) => products.productId._id.toString() === productId
      );
     
      existingProduct.quantity = quantity;

      const updatedCart = await cart.save();

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
