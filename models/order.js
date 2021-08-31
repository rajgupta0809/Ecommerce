const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productsCartSchema = new mongoose.Schema({
    products: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
});

const ProductCart = mongoose.model("ProductCart" , productsCartSchema);

const orderSchema = new mongoose.Schema({
    products: [productsCartSchema],
    transaction_id: {},
    amount: Number,
    address: String,
    status: {
        type: String,
        default: "",
        enum: ["Cancelled" , "Delivered" , "Shipped" , "Processing" , "Received"]
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
},{timestamps: true}
);
const Order = mongoose.model("Order" , orderSchema);

module.exports = {Order , ProductCart};