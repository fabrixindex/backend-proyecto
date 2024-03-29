import { productsService } from "../services/products.service.js";
import CustomError from "../utils/errorHandler/customError.js";
import EnumErrors from "../utils/errorHandler/enum.js";
import { generateProductIdErrorInfo, dataBaseErrroProducts } from "../utils/errorHandler/info.js"; 

const ProductsService = new productsService()

export const getAllProductsController = async (req, res) => {
    try{
        const { limit = 10, page = 1, sort, category, available } = req.query;

        const baseUrl = `${req.protocol}://${req.get("host")}${
            req.originalUrl.split("?")[0]}`;
        
            const productos = await ProductsService.getAllProducts(
                limit,
                page,
                sort,
                category,
                available,
                baseUrl
              );
          
              res.status(200).send({ status: "success", products: productos });

    }catch(error) {
        res
          .status(500)
          .send({ status: "error", message: "Error al obtener los productos" });
    };
};

export const getProductByIdController = async (req, res) => {
    try{
        const productId = req.params.pid;

        const product = await ProductsService.getProductById(productId);

        if (product) {
            res.status(200).send({ status: "success", product });
          } else {
            const errorInfo = generateProductIdErrorInfo();
            const CustomE = CustomError.createError({
                name: EnumErrors.NOT_FOUND_ENTITY_ID_ERROR.type,
                message: errorInfo,
                code: EnumErrors.NOT_FOUND_ENTITY_ID_ERROR.type,
            });

        };
    }catch (error) {
        const errorInfo = dataBaseErrroProducts();
        const CustomE = CustomError.createError({
            name: EnumErrors.DATABASE_ERROR.type,
            message: errorInfo,
            code: EnumErrors.DATABASE_ERROR.type,
            cause: error.message,
        })
      }
};

export const createProductController = async (req, res) => {
    try{
        const newProductData = req.body;
        const { role, email } = req.session.user;
    
        if (role === "premium") {
            newProductData.owner = email; 
          } else {
            newProductData.owner = "admin";
        };

        const allProducts = await ProductsService.getAllProducts();
        
        const findCode = allProducts.products.find(
            (product) => product.code === newProductData.code
        );

        if (findCode) {
            return res.status(400).json({
                message: "El código del producto ya existe. No se puede repetir.",
            });
        };

        const newProduct = await ProductsService.createProduct(newProductData);

        if (newProduct) {
        return res.status(201).json({
            message: "Producto agregado exitosamente",
            product: newProduct,
        });
        } else {
            req.logger.error('Error al crear el producto!')

            return res.status(500).json({
                message: "Error al agregar el producto en la base de datos",
            });
        };

    }catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error al agregar el producto",
          error: error.message,
        });
      };
};

export const updateProductController = async (req, res) => {
    try{
        const productId = req.params.pid;
        const updatedData = req.body;
        
        const productToUpdate = await ProductsService.getProductById(productId);

        if (!productToUpdate) {
          return res
            .status(404)
            .send({ status: "failed", message: "Producto no existente" });
        };

        const result = await ProductsService.updateProduct(productId, updatedData);

        res.status(200).send({ message: result.message, product: result.product });

    }catch (error) {
        res.status(500).send({ message: "Error al actualizar el producto" });
    };
};

export const DeleteProductByIdController = async (req, res) => {
    try{
        const productId = req.params.pid;

        const result = await ProductsService.DeleteProductById(productId);

        if (result.deletedCount === 0) {
        return res.status(404).json({
            status: false,
            message: "No se encontró el producto con el ID proporcionado",
        });
        };

        return res.status(200).json({
        status: true,
        message: "Producto eliminado exitosamente",
        });

    }catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Error al eliminar el producto",
            error: error.message,
        });
  };
};

export const getMockingProductsController = (req, res) => {
    ProductsService.getMockingProducts()
      .then((products) => {
        res.status(200).send({ status: 1, products: products });
      })
      .catch((error) => {
        res
          .status(500)
          .send({ status: "error", message: "Error al obtener mocking Products" });
      });
  };

export const sendProductImageController = async (req, res) => {
    try{
        const productId = req.params.pid;

        const file = req.files[0];

        if (!file) {
          return res
            .status(400)
            .json({ message: "No se proporcionó un archivo de imagen" });
        }
    
        const currentDate = new Date(Date.now()).toISOString().split("T")[0];
        const fileName = `${currentDate}-${file.originalname}`;

        await ProductsService.sendProductImage(productId, fileName);

        res.status(200).json({ status: 'success', message: 'Thumbnails de producto actualizadas' });
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Error al enviar la imagen.",
            error: error.message,
        });
    }
};