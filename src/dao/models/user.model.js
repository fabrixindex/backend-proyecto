import mongoose from 'mongoose';

const collection = 'Users';

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
    },
    userRole: {
        type: String,
        enum: ["user", "admin", "premium", "test"],
        default: "user"
    },
    last_connection: {
        type: Date,
        select: true, 
    },
    documents: [{
            name:  String,
            reference: String,
    }],
    profile: [{
            name: String,
            reference: String,
    }],
    deleted: {
        type: Boolean,
        default: false
    } 
});
 
const userModel = mongoose.model(collection, schema);

export default userModel;