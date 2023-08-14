import productsDao from "../dao/managers/productManager-mongodb.js"

export class productsService {
    constructor() {
        this.dao = new productsDao();
    };

    getAllProducts() {
        return this.dao.getAllproducts();
    };

    getProductById(id) {
        return this.dao.getProductById(id);
    };

    createProduct(newProductData) {
        return this.dao.createProduct(newProductData);
    };

    updateProduct(id, updateBodyProduct) {
        return this.dao.updateProduct(id, updateBodyProduct);
    };

    DeleteProductById(id) {
        return this.dao.DeleteProductById(id);
    };
};