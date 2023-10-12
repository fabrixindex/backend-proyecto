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
        enum: ["user", "admin", "premium"],
        default: "user"
    },
    last_connection: {
        type: Date,
        select: true, 
    },
    documents: [{
            name:  String,
            reference: String,
    }] 
});
 
const userModel = mongoose.model(collection, schema);

export default userModel;