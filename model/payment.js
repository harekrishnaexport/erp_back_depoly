const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    medical: {
        type: String,
    },
    invoiceId: {
        type: String,
    },
    totalamount: {
        type: String,
    },
    payamount: {
        type: Number,
    },
    status: {
        type: Boolean,
    },
    pandingamount: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now
    }
  
});

const PaymentDeatails = mongoose.model("paymentdetails", PaymentSchema);
module.exports = PaymentDeatails;
