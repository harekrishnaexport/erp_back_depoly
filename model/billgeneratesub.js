const mongoose = require("mongoose");
const { Schema } = mongoose;

const BillGeneratesubSchema = new Schema({
    medical: {
        type: String,
    },
    product: {
        type: String,
    },
    invoiceId: {
        type: Number,
    },
    rate: {
        type: Number,
    },
    mrp: {
        type: Number,
    },
    qty: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    salesmen: {
        type: String,
    },
    return:{
        type:Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Billgeneratesub = mongoose.model("billgeneratesub", BillGeneratesubSchema);
module.exports = Billgeneratesub;
