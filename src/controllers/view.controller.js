import { productsService } from "../services/products.service.js";
import { cartService } from "../services/cart.service.js";
import { usersService } from "../services/users.service.js";
import allUsersDTO from "../dto/allUsers.dto.js";

export const register = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
};

export const profile = async (req, res) => {
  try {
    const isAdmin = req.session.user.role === "admin";
    const userId = req.session.user._id;

    let fileName = "/img/sin-foto.jpg";

    if (
      req.session.user &&
      req.session.user.profile &&
      req.session.user.profile.length > 0
    ) {
      fileName = req.session.user.profile[0].name;
    }

    const imageUrl = `/uploads/profiles/${userId}/${fileName}`;

    res.render("profile", {
      user: req.session.user,
      isAdmin: isAdmin,
      imageUrl: imageUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    res.render("resetPassword");
  } catch (error) {
    console.log(error);
  }
};

export const staticProducts = async (req, res) => {
  try {
    const ProdServ = new productsService();
    const products = await ProdServ.getAllProducts();
    res.render("home", { products: products, style: "home.css" });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error al obtener los productos" });
  }
};

export const realtimeproducts = async (req, res) => {
  try {
    res.render("realTimeProducts");
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error al obtener los productos" });
  }
};

export const products = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, category, available } = req.query;

    const baseUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl.split("?")[0]
    }`;

    const isAdmin = req.session.user.role === "admin";

    const ProdServ = new productsService();

    const products = await ProdServ.getAllProducts(
      limit,
      page,
      sort,
      category,
      available,
      baseUrl
    );

    const userId = req.session.user._id;

    let fileName = "/img/sin-foto.jpg";

    if (
      req.session.user &&
      req.session.user.profile &&
      req.session.user.profile.length > 0
    ) {
      fileName = req.session.user.profile[0].name;
    }

    const imageUrl = `/uploads/profiles/${userId}/${fileName}`;

    res.render("home", {
      products: products,
      user: req.session.user,
      isAdmin: isAdmin,
      imageUrl: imageUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      message:
        "Error al obtener los productos. Por favor, inténtelo de nuevo más tarde.",
    });
  }
};

export const carts = async (req, res) => {
  try {
    const cartId = req.params.cartId;

    const CartService = new cartService();
    const cart = await CartService.getCartById(cartId);

    res.render("cart", { cart: cart });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error al obtener el carrito" });
  }
};

export const webChat = async (req, res) => {
  try {
    const user = req.session.user;
    res.render("chat", { user });
  } catch (error) {
    console.log(error);
  }
};

export const restorePass = async (req, res) => {
  try {
    const token = req.token;
    res.render("resetPassword", { token });
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailToRestorePass = async (req, res) => {
  try {
    res.render("emailToRestorePass");
  } catch (error) {
    console.log(error);
  }
};

export const adminUpdateOrDeleteUser = async (req, res) => {
  try {
    const userServ = new usersService();
    const users = await userServ.getAllUsers();
    const allusers = new allUsersDTO(users);

    res.render("admin-updateOrDeleteUser", { users: allusers });
  } catch (error) {
    console.log(error);
  }
};
