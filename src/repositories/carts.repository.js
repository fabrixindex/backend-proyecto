export default class cartsRepository {

    constructor(dao){
        this.dao = dao;
    };

    addCart = async () => {
        try{
            const newCart = await this.dao.addCart();
            return newCart;
        }catch(error){
            console.log(error)
        }
    };

    getCartById = async (cartId) => {
        try{
            const cartData = await this.dao.getCartById(cartId);
            return cartData;
        }catch(error){
            console.log(error)
        }
    };

    addProductToCart = async (cartId, productId, quantity) => {
        try{
            const cart = await this.dao.addProductToCart(cartId, productId, quantity);
            return cart;
        }catch(error){
            console.log(error)
        }
    };

    DeleteCartById = async (cartId) => {
        try{
            const cartDeleted = await this.dao.DeleteCartById(cartId);
            return cartDeleted;
        }catch(error){
            console.log(error)
        }
    };

    removeProductFromCart = async (cartId, productId) => {
        try{
            const cartWithProductRemoved = await this.dao.removeProductFromCart(cartId, productId);
            return cartWithProductRemoved;
        }catch(error){
            console.log(error)
        }
    };

    UpdateDataCart = async (cartId, products) => {
        try{
            const cartUpdated = await this.dao.UpdateDataCart(cartId, products);
            return cartUpdated; 
        }catch(error){
            console.log(error)
        }
    };

    emptyCart = async (cartId) => {
        try{
            const cartToEmpty = await this.dao.emptyCart(cartId);
            return cartToEmpty;
        }catch(error){
            console.log(error)
        }
    }

    updateQuantityOfProduct = async (cartId, productId, quantity) => {
        try{
            const cartWithQuantityUpdated = await this.dao.updateQuantityOfProduct(cartId, productId, quantity);
            return cartWithQuantityUpdated;
        }catch(error){
            console.log(error)
        }
    };
};