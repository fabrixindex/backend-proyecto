export default class ProductsRepository {
    
    constructor(dao){
        this.dao = dao;
    }; 

    getAllProducts = async (
        limit = 10,
        page = 1,
        sort,
        category,
        available
        ) => {
            try{
                const products = await this.dao.getAllProducts(limit, page, sort, category, available);
                return products;
            }catch(error){
                console.log(error)
            };
    };

    getProductById = async (id) => {
        try{
            const product = await this.dao.getProductById(id);
            return product;
        }catch(error){
            console.log(error)
        };
    };

    createProduct = async (newProductData) => {
        try{
            const newProduct = await this.dao.createProduct(newProductData);
            return newProduct;
        }catch(error){
            console.log(error)
        }
    };

    updateProduct = async (id, product) => {
        try{
            const updatedProduct = await this.dao.updateProduct(id, product);
            return updatedProduct;
        }catch(error){
           console.log(error) 
        };
    };

    DeleteProductById = async (id) => {
        try{
            const deletedProduct = await this.dao.DeleteProductById(id);
            return deletedProduct;
        }catch(error){
            console.log(error)
        }
    };

    sendProductImage = async (id, newThumbnails) => {
        try{
            const product = await this.dao.sendProductImage(id, newThumbnails)
            return product;
        }catch(error){
            console.log(error)
        }
    }
};