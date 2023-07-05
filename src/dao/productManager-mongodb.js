import productsModel from "./models/products.models.js";

class productManagerMongodb{

    constructor(){
        this.productsModel = productsModel;
    }

    async getAllproducts(){
        try{
            const products = await this.productsModel.find({})
            
            return products
        }catch(error){
            console.log(error);
        }
    };

    async getProductById(id){
        try{
            const productData = await this.productsModel.findOne({ _id: id})

            if (!productData) {
                return null;
              }

            return productData
        }catch(error){
            console.log(error);
        }
    };

    async createProduct(    
        title,
        description,
        price,
        thumbnails = [],
        code,
        stock,
        status = true,
        category
        ) {
        try {
            if (
                !title ||
                !description ||
                !price ||
                !code ||
                !stock ||
                !status ||
                !category
              )
                return `Todos los campos son obligatorios. El producto ${title} tiene un campo vacío!`;
        
        const allProducts = await this.getAllproducts();

        /*--------------------------- EVITAR REPETICION DE PRODUCTOS ---------------------------------------*/
        const findCode = allProducts.find((product) => product?.code === code);
        if (findCode)
        return `El Codigo del producto ya existe. No se puede repetir!`;

        const newProduct = await this.productsModel.create({
            title,
            description,
            price,
            code,
            stock,
            status,
            category,
        });

        return newProduct
        }catch(error){
            console.log(error);
        }
    };

    async updateProduct(id, updateBodyProduct){
        try{
            const updatedProduct = await this.productsModel.updateOne({ _id: id }, updateBodyProduct, {new: true})

            if (!updatedProduct) {
                return `No se encontró el producto con ID ${id}.`;
              };
            
              //const updatedProduct = { ...updateProduct, ...updateBodyProduct };
              //const allProducts = await this.getAllproducts();

              //const updatedProducts = allProducts.map((product) => {
                //if (product.id === id) {
                  //return updatedProducts;
                //}
                //return product;
              //});
              return {
                message: `Se ha actualizado el producto con ID ${id}.`,
                product: updatedProduct,
              };
        }catch{
            console.log(error);
        }
    }

    async DeleteProductById(id){
        try{
            const productDeleted = await this.productsModel.deleteOne({ _id: id})

            if (productDeleted === 0) {
                return `No se encontró el producto con ID ${id}.`;
              }

            return productDeleted;
        }catch(error){
            console.log(error);
        }
    }
};

export default productManagerMongodb;