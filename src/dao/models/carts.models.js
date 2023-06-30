import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({

    id: {
        type: Number,
        require: true
    },
    product: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    }
});

const cartsModel = mongoose.model(cartsCollection, cartSchema);

export default cartsModel;
