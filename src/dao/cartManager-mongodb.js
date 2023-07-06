import cartsModel from "./models/carts.models.js";
import productManagerMongodb from "./productManager-mongodb.js";

const producManagerMdb = new productManagerMongodb()

class cartManagerMongodb{
    constructor(){
        this.cartsModel = cartsModel
    }

    async getAllCarts(){
        try{
            const carts = await this.cartsModel.find({})
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
        const cartData = await this.cartsModel.findOne({ _id: id})

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
    
        const product = await producManagerMdb.getProductById(productId);
        if (!product) {
          console.log(`No se encontró el producto con ID ${productId}.`);
          return { success: false, message: "Product not exist" };
        }
    
        const existingProduct = cart.products.find(
          (product) => product.id === productId
        );
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ id: productId, quantity: quantity });
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
    }    
};

export default cartManagerMongodb;