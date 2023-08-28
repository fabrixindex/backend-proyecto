import { productsService } from "../services/products.service.js";
import { cartService } from "../services/cart.service.js";

export const register = async (req, res) => {
    try{
        res.render("register");
    }catch(error){
        console.log(error)
    }
};

export const login = async (req, res) => {
    try{
        res.render("login");
    }catch(error){
        console.log(error)
    }
};

export const profile = async (req, res) => {
    try{
        const isAdmin = req.session.user.role === 'admin';
        res.render("profile", {
        user: req.session.user,
        isAdmin: isAdmin
        });       
    }catch(error){
        console.log(error)
    }
};

export const resetPassword = async (req, res) => {
    try{
        res.render("resetPassword")
    }catch(error){
        console.log(error)
    }
};

export const staticProducts = async (req, res) => {
    try{
        const ProductsService = new productsService(); 
        const products = await ProductsService.getAllproducts();
        res.render("home", { products: products });
    }catch(error){
        res
        .status(500)
        .send({ status: "error", message: "Error al obtener los productos" });
    }
};

export const realtimeproducts = async (req, res) => {
    try{
        res.render("realTimeProducts");
    }catch(error){
        res
        .status(500)
        .send({ status: "error", message: "Error al obtener los productos" });
    }
};

export const products = async (req, res) => {
    try{
        const { limit = 10, page = 1, sort, category, available } = req.query;

        const baseUrl = `${req.protocol}://${req.get("host")}${
        req.originalUrl.split("?")[0]
        }`;

        const isAdmin = req.session.user.role === 'admin';

        const ProductsService = new productsService();

        const products = await ProductsService.getAllproducts(
        limit,
        page,
        sort,
        category,
        available,
        baseUrl
        );

        res.render("home", { products: products, user: req.session.user, isAdmin: isAdmin });
    }catch(error){
        console.log(error);
            res.status(500).send({
            status: "error",
            message:
                "Error al obtener los productos. Por favor, inténtelo de nuevo más tarde.",
            });
    }
};

export const carts = async (req, res) => {
    try{
        const cartId = req.params.cartId;
        
        const CartService = new cartService()
        const cart = await CartService.getCartById(cartId);

        res.render("cart", { cart: cart });
    }catch(error){
        res
        .status(500)
        .send({ status: "error", message: "Error al obtener el carrito" });
    }
};

export const webChat = async (req, res) => {
    try{
        res.render('chat');
    }catch(error){
        console.log(error)
    }
};



