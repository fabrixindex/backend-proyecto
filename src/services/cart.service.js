import cartDao from "../dao/managers/cartManager-mongodb.js"

export class cartService {
    constructor() {
        this.dao = new cartDao();
    };

    addCart() {
        return this.dao.addCart();
    };

    getCartById(id) {
        return this.dao.getCartById(id);
    };

    addProductToCart(cartId, productId, quantity) {
        return this.dao.addProductToCart(cartId, productId, quantity);
    };

    DeleteCartById(id) {
        return this.dao.DeleteCartById(id);
    };

    removeProductFromCart(cartId, productId) {
        return this.dao.removeProductFromCart(cartId, productId);
    };

    emptyCart(cartId) {
        return this.dao.emptyCart(cartId);
    };

    UpdateDataCart(cartId, products) {
        return this.dao.UpdateDataCart(cartId, products);
    };

    updateQuantityOfProduct(cartId, productId, quantity) {
        return this.dao.updateQuantityOfProduct(cartId, productId, quantity);
    }
};