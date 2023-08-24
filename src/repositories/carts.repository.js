import { cartsDaoFactory } from "../dao/factory.js";

const CartsDaoFactory = cartsDaoFactory.getDao()

export default class cartsRepository {

    constructor(){
        this.dao = CartsDaoFactory;
    };

    addCart = async () => {
        try{
            const newCart = await this.dao.addCart();
            return newCart;
        }catch(error){
            console.log(error)
        }
    };

    getCartById = async (id) => {
        try{
            const cartData = await this.dao.getCartById(id);
            return cartData;
        }catch(error){
            console.log(error)
        }
    };

    /*addProductToCart = async (cartId, productId, quantity) => {
        try{

        }catch(error){

        }
    };*/

    DeleteCartById = async (id) => {
        try{
            const cartDeleted = await this.dao.DeleteCartById(id);
            return cartDeleted;
        }catch(error){
            console.log(error)
        }
    };

    /*removeProductFromCart = async (cartId, productId) => {
        try{

        }catch(error){

        }
    };*/

    UpdateDataCart = async (cartId, products) => {
        try{
            const cart = await this.dao.UpdateDataCart(cartId, products);
            return cart; 
        }catch(error){
            console.log(error)
        }
    };

    /*updateQuantityOfProduct = async (cartId, productId, quantity) => {
        try{

        }catch(error){
            console.log(error)
        }
    };*/
};