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

  async getCartById(cartId) {
    try {
      const cartData = await this.cartsModel.findById({ _id: cartId }).lean();
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
      };

      const updatedCart = await cart.save();

      return {
        finalCart: updatedCart,
        success: true,
      };

    } catch (error) {
        console.log(error);
    }
  };

  async DeleteCartById(cartId) {
    try {
      const cartDeleted = await this.cartsModel.deleteOne({ _id: cartId });
      return cartDeleted;
    } catch (error) {
      console.log(error);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.cartsModel.findById(cartId);

      const indexProducto = productManagerMdb.getProductById(productId);

      cart.products.splice(indexProducto);

      const updatedCart = await this.cartsModel.findByIdAndUpdate(
        cartId,
        { products: cart.products },
        { new: true }
      );

      return {
        finalCart: updatedCart,
        success: true,
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

      return {
        finalCart: updatedCart,
        success: true,
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

      return {
        finalCart: updatedCart,
        success: true,
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

      return {
        finalCart: updatedCart,
        success: true,
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
