const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductListSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ProductList = mongoose.model("productlist", ProductListSchema);
module.exports = ProductList;
