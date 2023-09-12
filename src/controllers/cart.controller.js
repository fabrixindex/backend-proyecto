import { cartService } from "../services/cart.service.js";

const CartService = new cartService();

export const addCartController = async (req, res) => {
    try{
        const newCart = await CartService.addCart();
        res.status(200).send({ status: "success", cartId: newCart._id });

    }catch (error) {
        res
          .status(500)
          .send({ status: "error", payload: "Error al agregar el carrito" });
    };
};

export const getCartByIdController = async (req, res) => {
    try{
        const cartId = req.params.cid;
        const cart = await CartService.getCartById(cartId);
    
        if (cart) {
          res.status(200).send({ status: "success", cart });
        } else {
          res
            .status(404)
            .send({ status: "error", message: "Carrito no encontrado." });
        };

    }catch (error) {
        res
        .status(500)
        .send({ status: "error", message: "Error al obtener el carrito." });
    };
};

export const addProductToCartController = async (req, res) => {
    try{
        const { cid, pid } = req.params;

        const cartId = cid;
        const productId = pid;
        const quantity = req.body.quantity ? parseInt(req.body.quantity) : 1;
    
        const result = await CartService.addProductToCart(
          cartId,
          productId,
          quantity
        );

        if (!result.success) {
          return res
            .status(404)
            .json({ status: "failed", message: result.message });
        };
    
        res.status(200).json({ 
          message: "Producto añadido al carrito!",
          payload: result,
         });

    }catch (error) {
        res
        .status(500)
        .json({ error: "Ocurrió un error al agregar el producto al carrito" });
  };
};

export const DeleteCartByIdController = async (req, res) => {
    try{
        const cartId = req.params.cid;

        const result = await CartService.DeleteCartById(cartId);

        return res.status(200).json({
        message: "carrito eliminado exitosamente",
        payload: result,
        });

    }catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error al eliminar el carrito",
            error: error.message,
        });
    };
};

export const removeProductFromCartController = async (req, res) => {
    try{
        const { cid, pid } = req.params;

        const cartId = cid;
        const productId = pid;
    
        const cartProd = await CartService.removeProductFromCart(cartId, productId);
    
        if (cartProd.success) {
          res.status(200).json({
            status: "success",
            message: "Producto eliminado del carrito exitosamente.",
            cart: cartProd.finalCart,
          });
        } else {
          res.status(404).json({
            status: "error",
            message: "No se pudo eliminar el producto del carrito.",
          });
        };

    }catch (error) {
        res.status(500).json({
          status: "error",
          message: "Ocurrió un error al eliminar el producto del carrito.",
        });
      };
};

export const emptyCartController = async (req, res) => {
    try{
        const { cid } = req.params;

        const cartId = cid;

        const emptyCartResult = await CartService.emptyCart(cartId);

        if (emptyCartResult.success) {
            res.status(200).json({
                status: "success",
                message: "Se eliminaron todos los productos del carrito exitosamente.",
                cart: emptyCartResult.finalCart,
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "No se pudo vaciar el carrito.",
            });
        };

    }catch (error) {
        res.status(500).json({
          status: "error",
          message: "Ocurrió un error al vaciar el carrito.",
        });
      };
};

export const UpdateDataCartController = async (req, res) => {
    try{
        const cartId = req.params.cid;
        const newProducts = req.body.products;

        const response = await CartService.UpdateDataCart(cartId, newProducts);

        if (response.success) {
        res.status(200).json({
          payload: response,
          message: "Productos actualizados en el carrito exitosamente.",  
        });
        } else {
        res.status(400).json(response);
        }
    }catch (error) {
        res.status(500).json({
          success: false,
          message: "Ocurrió un error al actualizar los productos en el carrito.",
        });
      };
};

export const updateQuantityOfProductController = async (req, res) => {
    try{
        const { cid, pid } = req.params;
        const { quantity } = req.body;
    
        const cartId = cid;
        const productId = pid;
    
        const updateQuantityResult = await CartService.updateQuantityOfProduct(
          cartId,
          productId,
          quantity
        );
    
        if (updateQuantityResult.success) {
          res.status(200).json({
            status: "success",
            message: "Se actualizó la cantidad del producto en el carrito, exitosamente!",
            cart: updateQuantityResult.finalCart,
          });
        } else {
          res.status(404).json({
            status: "error",
            message:
              "No se pudo actualizar la cantidad del producto en el carrito.",
          });
        };

    }catch (error) {
        res.status(500).json({
            status: "error",
            message: "Ocurrió un error al actualizar la cantidad del producto en el carrito.",
        });
    };
};

export const checkoutCartController = async (req, res) => {
  
  try {
      const cartId = req.params.cid;

      const { name } = req.session.user;

      const purchaser = `${name}`

      const purchaseCartResult = await CartService.checkoutCart(cartId, purchaser); 

      res.status(201).send({ 
        status: 1, 
        message: 'Cart successfully purchased!', 
        purchaseCartResult: purchaseCartResult, 
      });
      
  } catch (error) {
      console.log(error);
  }
};

