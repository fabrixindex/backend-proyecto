import cartsModel from "./models/carts.models.js";
import productManagerMongodb from "./productManager-mongodb.js";

const productManagerMdb = new productManagerMongodb()

class cartManagerMongodb{
    constructor(){
        this.cartsModel = cartsModel
    }

    async getAllCarts(){
        try{
            const carts = await this.cartsModel.find({}).lean().exec()
            return carts
        }catch(error){
            console.log(error);
        }
    };

    async addCart(products = []){
        try{
            const allCarts = await this.getAllCarts();
            
            allCarts.push({
                products 
            });

            const newCart = await this.cartsModel.create(allCarts)

            return newCart
        }catch(error){
            console.log(error);
        }
    };

    async getCartById(id){
      try{
        const cartData = await this.cartsModel.findOne({ _id: id}).lean().exec()

        if (!cartData) {
          throw new Error(`No se encontró el carrito con ID ${id}.`);
        }

      return cartData
      }catch(error){
        throw new Error("Ocurrió un error al obtener el carrito por ID.");
      }
    };

    async addProductToCart(cartId, productId, quantity) {
      try {
        const cart = await this.getCartById(cartId);

        if (!cart) {
          console.log(`No se encontró el carrito con ID ${cartId}.`);
          return { success: false, message: "Cart not exist" };
        }
    
        const product = await productManagerMdb.getProductById(productId);
        if (!product) {
          console.log(`No se encontró el producto con ID ${productId}.`);
          return { success: false, message: "Product not exist" };
        }

        const existingProduct = cart.products.find((products) => products.productId._id.toString() === productId);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          cart.products.push({ product: product, quantity: 1 })
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
    };
    
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
    };
    
    async removeProductFromCart(cartId, productId) {
      try {
        const cart = await this.getCartById(cartId);
    
        if (!cart) {
          console.log(`No se encontró el carrito con ID ${cartId}.`);
          return { success: false, message: "El carrito no existe" };
        }
    
        const indexProducto = productManagerMdb.getProductById(productId)
    
        if (indexProducto === -1) {
          console.log(`No se encontró el producto con ID ${productId} en el carrito.`);
          return { success: false, message: "El producto no existe en el carrito" };
        }
    
        cart.products.splice(indexProducto, 1);
    
        const updatedCart = await this.cartsModel.findByIdAndUpdate(cartId, { products: cart.products }, { new: true });
    
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
    };
    
    async emptyCart(cartId) {
      try {
        const cart = await this.getCartById(cartId);
    
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
    
        console.log(`Se eliminaron todos los productos del carrito con ID ${cartId}.`);
    
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
    };

    async UpdateDataCart(cartId, products) {
      try {
        const cart = await this.getCartById(cartId);
    
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
    };    
    
    async updateQuantityOfProduct(cartId, productId, quantity) {
      try {
        const cart = await this.getCartById(cartId);
    
        if (!cart) {
          console.log(`No se encontró el carrito con ID ${cartId}.`);
          return { success: false, message: "El carrito no existe" };
        }
    
        const existProduct = await productManagerMdb.getProductById(productId);
    
        if (existProduct === -1) {
          console.log(`No se encontró el producto con ID ${productId} en el carrito.`);
          return { success: false, message: "El producto no existe en el carrito" };
        }else{
          existProduct.quantity = quantity;
        }
    
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
          message: "Se actualizó la cantidad del producto en el carrito exitosamente.",
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Ocurrió un error al actualizar la cantidad del producto en el carrito.",
        };
      }
    };    
};

export default cartManagerMongodb;