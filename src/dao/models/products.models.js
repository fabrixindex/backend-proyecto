import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = 'products';

const productSchema = new mongoose.Schema({

    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    thumbnails: {
        type: String,
    },
    code: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true 
    }
});

productSchema.plugin(mongoosePaginate);

const productsModels = mongoose.model(productsCollection, productSchema);

export default productsModels;
