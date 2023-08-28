import cartsRepository from "../repositories/carts.repository.js";
import { productsService } from "./products.service.js";
import ticketService from "../services/tickets.service.js"

export class cartService {
    constructor() {
        this.cartsRepository = cartsRepository;
        this.productsService = new productsService();
        this.ticketService = new ticketService();
    };

    addCart = async () => {
        try{
            const newCart = await this.cartsRepository.addCart();
            return newCart;
        }catch(error){
            console.log(error)
        }
    };

    getCartById = async (id) => {
        try{
            const cartData = await this.cartsRepository.getCartById(id);
            
            if (!cartData) {
                throw new Error(`No se encontró el carrito con ID ${id}.`);
              };

            return cartData;
        }catch(error) {
            console.log(error)
        }
    };

    addProductToCart = async (cartId, productId, quantity) => {
        try{
            const cart = await this.cartsRepository.findById(cartId);

            if (!cart) {
                console.log(`No se encontró el carrito con ID ${cartId}.`);
                return { success: false, message: "Cart not exist" };
              };
            
            const product = await this.productsService.getProductById(productId);

            if (!product) {
                console.log(`No se encontró el producto con ID ${productId}.`);
                return { success: false, message: "Product not exist" };
              };
            
            const existingProduct = cart.products.find(
                (products) => products.productId._id.toString() === productId
            );

            if (existingProduct) {
                existingProduct.quantity += 1;
              } else {
                cart.products.push({ productId: productId, quantity: 1 });
              };
            
            const updatedCart = await this.cartsRepository.addProductToCart();
              
            if (!updatedCart) {
                console.log(`Error al actualizar el carrito con ID ${cartId}.`);
                return { success: false, message: "Failed to update cart" };
              };

            return updatedCart;
        }catch(error){
            console.log(error)
        }
        return this.dao.addProductToCart(cartId, productId, quantity);
    };

    DeleteCartById = async (id) => {
        try{
            const cartDeleted = await this.cartsRepository.DeleteCartById(id);

            if (cartDeleted.deletedCount === 0) {
              return `No se encontró el carrito con ID ${id}.`;
            };
      
            return cartDeleted;

        }catch(error){
            console.log(error)
        }
    };

    removeProductFromCart = async (cartId, productId) => {
        try{
            const cart = await this.cartsRepository.getCartById(cartId);

            if (!cart) {
                console.log(`No se encontró el carrito con ID ${cartId}.`);
                return { success: false, message: "El carrito no existe" };
            };

            const indexProducto = productsService.getProductById(productId);

            if (indexProducto === -1) {
                console.log(
                  `No se encontró el producto con ID ${productId} en el carrito.`
                );
                return {
                  success: false,
                  message: "El producto no existe en el carrito",
                };
              };
            
            cart.products.splice(indexProducto, 1);

            const updatedCart = await this.cartsRepository.removeProductFromCart(
                cartId,
                { products: cart.products },
                { new: true }
              );

              if (!updatedCart) {
                console.log(`Error al actualizar el carrito con ID ${cartId}.`);
                return { success: false, message: "Error al actualizar el carrito" };
              };

              return {
                finalCart: updatedCart,
                success: true,
                message: "Producto eliminado del carrito exitosamente.",
              };
        }catch(error){
            console.log(error)
        }
    };

    emptyCart = async (cartId) => {
        try{
            const cart = await this.cartsRepository.getCartById(cartId);
    
            if (!cart) {
                console.log(`No se encontró el carrito con ID ${cartId}.`);
                return { success: false, message: "El carrito no existe" };
              };
            
            const updatedCart = await this.cartsRepository.emptyCart();
    
            if (!updatedCart) {
                console.log(`Error al actualizar el carrito con ID ${cartId}.`);
                return { success: false, message: "Error al actualizar el carrito" };
            };
    
            return updatedCart;
        }catch(error){
            console.log(error)
        }
    };

    UpdateDataCart = async (cartId, products) => {
        try{
            const cart = await this.cartsRepository.getCartById(cartId);

            if (!cart) {
                console.log(`No se encontró el carrito con ID ${cartId}.`);
                return { success: false, message: "El carrito no existe" };
              };

            cart.products = products;

            const updatedCart = await this.cartsRepository.UpdateDataCart();

            if (!updatedCart) {
                console.log(`Error al actualizar el carrito con ID ${cartId}.`);
                return { success: false, message: "Error al actualizar el carrito" };
            };

            return {
                finalCart: updatedCart,
                success: true,
                message: "Productos actualizados en el carrito exitosamente.",
              };

        }catch(error){
            console.log(error)
        };
    };

    updateQuantityOfProduct = async (cartId, productId, quantity) => {
        try{
            const cart = await this.cartsRepository.getCartById(cartId);

            if (!cart) {
                console.log(`No se encontró el carrito con ID ${cartId}.`);
                return { success: false, message: "El carrito no existe" };
              };
            
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
              };

              existingProduct.quantity = quantity;

              const updatedCart = await this.cartsRepository.updateQuantityOfProduct()

              if (!updatedCart) {
                console.log(`Error al actualizar el carrito con ID ${cartId}.`);
                return { success: false, message: "Error al actualizar el carrito" };
              }

            return updatedCart;
        }catch(error){
            console.log(error)
        }
    };

    checkoutCart = async (cartId, purchaser) => {
        try{
            const cart = await this.cartsRepository.getCartById(cartId);

            if(!cart){
                throw new Error("cart not found")
            };

            if (cart.products.length === 0) {
                throw new Error("Cart is empty");
            };

            const products = cart.products;

            const productsPurchased = [];
            const productsNotPurchased = [];

            for (const product of products) {
                try {
                    await this.productService.updateProductStock(product.product._id.toString(), -product.quantity);
                    productsPurchased.push(product);
                } catch (error) {
                    productsNotPurchased.push(product);
                }
            };

            if (productsPurchased.length === 0) {
                throw new Error('No products were purchased');
            };

            await this.emptyCart(cartId);
            if (productsNotPurchased.length > 0) {
                const newCartProducts = productsNotPurchased.map((product) => {
                    return { productId: product.product._id.toString(), quantity: product.quantity }
                });
                await this.addProductToCart(cartId, newCartProducts);
            }
            const remainingCart = await this.getCartById(cartId);

            const totalAmount = productsPurchased.reduce((total, product) => total + (product.product.price * product.quantity), 0);
            const newTicket = await this.ticketService.createTicket({ amount: totalAmount, purchaser: purchaser });

            if (!newTicket) {
                throw new Error('Failed to create ticket');
            }

            const purchaseCartResult = {
                ticket: newTicket,
                productsPurchased: productsPurchased,
                productsNotPurchased: productsNotPurchased,
                remainingCart: remainingCart
            }

            return purchaseCartResult;


        }catch(error){
            console.log(error)
        }
    };
};