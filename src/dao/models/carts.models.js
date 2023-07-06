import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: [{
      id: {
        type: mongoose.Schema.Types.ObjectId
      },
      quantity: {
        type: Number
      }  
    }]
  });

const cartsModel = mongoose.model(cartsCollection, cartSchema);

export default cartsModel;
