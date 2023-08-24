import productsModel from "../models/products.models.js";

class productManagerMongodb {
  constructor() {
    this.productsModel = productsModel;
  }

  async getAllproducts(
    limit = 10,
    page = 1,
    sort,
    category,
    available,
    baseUrl
  ) {
    try {
      let query = this.productsModel.find();

      if (category) {
        const trimmedCategory = category.trim();
        const categoryRegex = new RegExp(`${trimmedCategory}`, "i");
        query = query.where("category").equals(categoryRegex);
      }

      if (available) {
        const lowerAvailable = available.toLowerCase();
        if (lowerAvailable === "true") {
          query = query.where("stock").gt(0);
        } else if (lowerAvailable === "false") {
          query = query.where("stock").equals(0);
        } else {
          throw new Error("Invalid available value. true or false expected");
        }
      }

      if (sort) {
        const lowerSort = sort.toLowerCase();
        if (lowerSort === "asc") {
          query = query.sort({ price: 1 });
        } else if (lowerSort === "desc") {
          query = query.sort({ price: -1 });
        } else {
          throw new Error("Invalid sort value. asc or desc expected");
        }
      }

      const products = await this.productsModel.paginate(query, {
        limit: parseInt(limit) || 10,
        lean: true,
        page: parseInt(page) || 1,
        customLabels: {
          docs: "products",
          totalDocs: "totalProducts",
        },
      });
      
      return products
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const productData = await this.productsModel.find({ _id: id });
      return productData;
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct(newProductData) {
    try {
      const newProduct = await this.productsModel.create(newProductData);
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, updateBodyProduct) {
    try {
      const updatedProduct = await this.productsModel.updateOne(
        { _id: id },
        updateBodyProduct,
        { new: true }
      );

      return {
        message: `Se ha actualizado el producto con ID ${id}.`,
        product: updatedProduct,
      };
    } catch {
      console.log(error);
    }
  }

  async DeleteProductById(id) {
    try {
      const productDeleted = await this.productsModel.deleteOne({ _id: id });
      return productDeleted;
    } catch (error) {
      console.log(error);
    }
  }
}

export default productManagerMongodb;
