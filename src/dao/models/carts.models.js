import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
      type: [ 
        { 
          productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products'
        },
        quantity: {
          type: Number,
          default: 0
        }
      }
      ],
      default: []  
    }
  });

cartSchema.pre('findOne', function(){
  this.populate('products.productId')
});

const cartsModel = mongoose.model(cartsCollection, cartSchema);

export default cartsModel;
