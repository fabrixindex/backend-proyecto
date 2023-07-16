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
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const productData = await this.productsModel.find({ _id: id });

      if (!productData) {
        return null;
      }

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

      if (!updatedProduct) {
        return `No se encontró el producto con ID ${id}.`;
      }

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

      if (productDeleted === 0) {
        return `No se encontró el producto con ID ${id}.`;
      }

      return productDeleted;
    } catch (error) {
      console.log(error);
    }
  }
}

export default productManagerMongodb;
