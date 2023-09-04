import { ProductsRepository } from "../repositories/index.js";
import { mockingProducts } from "../utils/mocks.js"
import CustomError from "../utils/errorHandler/customError.js"
import { generateProductIdErrorInfo } from "../utils/errorHandler/info.js";
import EnumErrors from "../utils/errorHandler/enum.js";

export class productsService {

    constructor(){
        this.productRepository = ProductsRepository;
    };

    getAllProducts = async (    
        limit = 10,
        page = 1,
        sort,
        category,
        available,
        baseUrl) => {
            try{
                if (category) {
                    const trimmedCategory = category.trim();
                    const categoryRegex = new RegExp(`${trimmedCategory}`, "i");
                    query = query.where("category").equals(categoryRegex);
                  };
            
                  if (available) {
                    const lowerAvailable = available.toLowerCase();
                    if (lowerAvailable === "true") {
                      query = query.where("stock").gt(0);
                    } else if (lowerAvailable === "false") {
                      query = query.where("stock").equals(0);
                    } else {
                      throw new Error("Invalid available value. true or false expected");
                    }
                  };
            
                  if (sort) {
                    const lowerSort = sort.toLowerCase();
                    if (lowerSort === "asc") {
                      query = query.sort({ price: 1 });
                    } else if (lowerSort === "desc") {
                      query = query.sort({ price: -1 });
                    } else {
                      throw new Error("Invalid sort value. asc or desc expected");
                    }
                  };

                  const products = await  this.productRepository.getAllProducts(limit, page, sort, category, available);

                  let navLinks = {};

                if (baseUrl) {
                    const sortOptions = ["asc", "desc"];
                    const availableOptions = ["true", "false"];
                    const sortQuery =
                    sort && sortOptions.includes(sort.toLowerCase())
                        ? `&sort=${sort}`
                        : "";
                    const categoryQuery = category
                    ? `&category=${encodeURIComponent(category)}`
                    : "";
                    const availableQuery =
                    available && availableOptions.includes(available.toLowerCase())
                        ? `&available=${available}`
                        : "";
                    navLinks = {
                    firstLink:
                        products.totalPages > 1
                        ? `${baseUrl}?limit=${limit}&page=1${sortQuery}${categoryQuery}${availableQuery}`
                        : null,
                    prevLink: products.hasPrevPage
                        ? `${baseUrl}?limit=${limit}&page=${products.prevPage}${sortQuery}${categoryQuery}${availableQuery}`
                        : null,
                    nextLink: products.hasNextPage
                        ? `${baseUrl}?limit=${limit}&page=${products.nextPage}${sortQuery}${categoryQuery}${availableQuery}`
                        : null,
                    lastLink:
                        products.totalPages > 1
                        ? `${baseUrl}?limit=${limit}&page=${products.totalPages}${sortQuery}${categoryQuery}${availableQuery}`
                        : null,
                    };
                }

                const productsWithLinks = { ...products, ...navLinks };
                return productsWithLinks;
            }catch(error){
                console.log(error)
            }
    };

    getProductById = async (id) => {
        try{
            const productData = await this.productRepository.getProductById(id)

            if (!productData) {
                CustomError.createError({
                    name: 'Product Id Error',
                    cause: generateProductIdErrorInfo(),
                    code: EnumErrors.INVALID_FIELDS_VALUE_ERROR,
                    message: 'Error trying to find a product!'
                })
            };
        
            return productData;

        }catch(error){
            console.log(error)
        }
    };

    createProduct = async (newProductData) => {
        try{
            const newProduct = await this.productRepository.createProduct(newProductData)
            return newProduct;
        }catch(error){
            console.log(error)
        }
    };

    updateProduct = async (id, updatedProductFields) => {
        try{
            const product = await this.productRepository.getProductById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return await this.productRepository.updateProduct(id, updatedProductFields);

        }catch(error){
            console.log(error)
        }
    };

    DeleteProductById = async (id) => {
        try{
            const productDeleted = await this.productRepository.DeleteProductById({ _id: id }); 

            if (productDeleted === 0) {
              return `No se encontró el producto con ID ${id}.`;
            }
      
            return productDeleted;

        }catch(error){
            console.log(error)
        }
    };
    
    updateProductStock = async (id, quantity) => {
        try {
            /*if (!quantity ) {
                throw new Error('Invalid quantity');
            }
            const product = await this.productRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }*/
            const newStock = product.stock + quantity;
            /*if (newStock < 0) {
                throw new Error('Not enough stock');
            }*/
            return await this.productRepository.updateProduct(id, { stock: newStock });
        } catch (error) {
            throw error;
        }
    };

    getMockingProducts = async () => {
        try {
            const products = await mockingProducts();
            return products;
        } catch (error) {
            throw error;
        }
    };
};