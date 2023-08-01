import mongoose from 'mongoose';

const collection = 'Users';

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        require: true,
    },
    last_name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    age: {
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
    },
    userRole: {
        type: String,
        default: "user"
    }
});
 
const userModel = mongoose.model(collection, schema);

export default userModel;