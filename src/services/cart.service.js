import { CartsRepository } from "../repositories/index.js";
import { productsService } from "./products.service.js";
import ticketService from "../services/tickets.service.js";
import variables from "../config/dotenv.config.js";
import { transportMail } from "../config/mailing.config.js";

const MAIL_AUTH_USER = variables.MAIL_AUTH_user;

export class cartService {
  constructor() {
    this.cartsRepository = CartsRepository;
    this.productsService = new productsService();
    this.ticketService = new ticketService();
  }

  addCart = async () => {
    try {
      const newCart = await this.cartsRepository.addCart();
      return newCart;
    } catch (error) {
      console.log(error);
    }
  };

  getCartById = async (cartId) => {
    try {
      const cartData = await this.cartsRepository.getCartById(cartId);

      if (!cartData) {
        throw new Error(`No se encontró el carrito con ID ${cartId}.`);
      }

      return cartData;
    } catch (error) {
      console.log(error);
    }
  };

  addProductToCart = async (cartId, productId, quantity) => {
    try {
      const updatedCart = await this.cartsRepository.addProductToCart(
        cartId,
        productId,
        quantity
      );

      if (!updatedCart) {
        console.log(`Error al actualizar el carrito con ID ${cartId}.`);
        return { success: false, message: "Failed to update cart" };
      }

      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };

  DeleteCartById = async (cartId) => {
    try {
      const cartDeleted = await this.cartsRepository.DeleteCartById(cartId);

      if (cartDeleted.deletedCount === 0) {
        return `No se encontró el carrito con ID ${cartId}.`;
      }

      return cartDeleted;
    } catch (error) {
      console.log(error);
    }
  };

  removeProductFromCart = async (cartId, productId) => {
    try {
      const cart = await this.cartsRepository.getCartById(cartId);

      if (!cart) {
        console.log(`No se encontró el carrito con ID ${cartId}.`);
        return { success: false, message: "El carrito no existe" };
      }

      const updatedCart = await this.cartsRepository.removeProductFromCart(
        cartId,
        productId
      );

      if (!updatedCart) {
        console.log(`Error al actualizar el carrito con ID ${cartId}.`);
        return { success: false, message: "Error al actualizar el carrito" };
      }

      return {
        finalCart: updatedCart,
        success: true,
        message: "Producto eliminado del carrito exitosamente.",
      };
    } catch (error) {
      console.log(error);
    }
  };

  emptyCart = async (cartId) => {
    try {
      const cart = await this.cartsRepository.getCartById(cartId);

      if (!cart) {
        console.log(`No se encontró el carrito con ID ${cartId}.`);
        return { success: false, message: "El carrito no existe" };
      }

      const updatedCart = await this.cartsRepository.emptyCart(cartId);

      if (!updatedCart) {
        console.log(`Error al actualizar el carrito con ID ${cartId}.`);
        return { success: false, message: "Error al actualizar el carrito" };
      }

      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };

  UpdateDataCart = async (cartId, products) => {
    try {
      const cart = await this.cartsRepository.getCartById(cartId);

      if (!cart) {
        console.log(`No se encontró el carrito con ID ${cartId}.`);
        return { success: false, message: "El carrito no existe" };
      }

      cart.products = products;

      const updatedCart = await this.cartsRepository.UpdateDataCart(
        cartId,
        products
      );

      if (!updatedCart) {
        console.log(`Error al actualizar el carrito con ID ${cartId}.`);
        return { success: false, message: "Error al actualizar el carrito" };
      }

      return {
        finalCart: updatedCart,
        success: true,
      };
    } catch (error) {
      console.log(error);
    }
  };

  updateQuantityOfProduct = async (cartId, productId, quantity) => {
    try {
      const cart = await this.cartsRepository.getCartById(cartId);

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

      const updatedCart = await this.cartsRepository.updateQuantityOfProduct(
        cartId,
        productId,
        quantity
      );

      if (!updatedCart) {
        console.log(`Error al actualizar el carrito con ID ${cartId}.`);
        return { success: false, message: "Error al actualizar el carrito" };
      }

      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };

  checkoutCart = async (cartId, purchaser, purchaserEmail) => {
    try {
      const cart = await this.cartsRepository.getCartById(cartId);

      if (!cart) {
        throw new Error("cart not found");
      }

      if (cart.products.length === 0) {
        throw new Error("Cart is empty");
      }

      const productsPurchased = [];
      const productsNotPurchased = [];

      cart.products.forEach((product) => {
        if (product.productId.stock > product.quantity) {
          productsPurchased.push(product);
          this.cartsRepository.removeProductFromCart(
            cartId,
            String(product.productId._id)
          );

          //ACTUALIZAR STOCK
          this.productsService.updateProduct(product.productId._id, {
            stock: product.productId.stock - product.quantity,
          });
        } else {
          productsNotPurchased.push(product);
        }
      });

      if (productsPurchased.length === 0) {
        throw new Error("No products were purchased");
      }

      if (productsNotPurchased.length > 0) {
        const newCartProducts = productsNotPurchased.map((product) => {
          return {
            productId: product.product._id.toString(),
            quantity: product.quantity,
          };
        });
        await this.cartsRepository.addProductToCart(cartId, newCartProducts);
      }

      //GENERAR CODE ALEATORIO
      let code;
      let isCodeUnique = false;
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      while (!isCodeUnique) {
        code = "";
        for (let i = 0; i < 8; i++) {
          code += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }

        const existingTicket = await this.ticketService.getTicketByCode(code);
        if (!existingTicket) {
          isCodeUnique = true;
        }
      }

      //CALCULAR TOTAL
      const totalAmount = productsPurchased.reduce((total, product) => {
        const price = product.productId.price;
        const quantity = product.quantity;

        return total + price * quantity;
      }, 0);

      //ENVIAR DATA PARA TICKET
      const newData = {
        code: code,
        amount: totalAmount,
        purchaser: purchaser,
      };

      const newTicket = await this.ticketService.createTicket(newData);

      if (!newTicket) {
        throw new Error("Failed to create ticket");
      }

      const purchaseCartResult = {
        ticket: newTicket,
        productsPurchased: productsPurchased,
        productsNotPurchased: productsNotPurchased,
      };

      const emailToSend = {
        from: `${MAIL_AUTH_USER}`,
        to: purchaserEmail,
        subject: `CatsBook || Confirmed Purchase`,
        html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 20px;">
                <h2>¡Compra Confirmada!</h2>
                <p>Estimado ${newTicket.purchaser},</p>
                <p>Tu compra ha sido exitosa. Aquí tienes los detalles de tu nuevo ticket:</p>
                <ul style="list-style: none;">
                    <li><strong>Código de Compra:</strong> ${
                      newTicket.code
                    }</li>
                    <li><strong>Monto:</strong> $${newTicket.amount.toFixed(
                      2
                    )}</li>
                    <li><strong>Comprador:</strong> ${newTicket.purchaser}</li>
                    <li><strong>Fecha de Compra:</strong> ${
                      newTicket.purchaseDatetime
                    }</li>
                </ul>
                <p>Gracias por tu compra en CatsBook.</p>
            </div>
            `,
      };

      const info = await transportMail.sendMail(emailToSend);

      return purchaseCartResult;
    } catch (error) {
      console.log(error);
    }
  };
}
