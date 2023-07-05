import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({

    products: {
        type: [{String,
            quantity: { type: Number, //required: true
    }
    }],
}
});

const cartsModel = mongoose.model(cartsCollection, cartSchema);

export default cartsModel;
