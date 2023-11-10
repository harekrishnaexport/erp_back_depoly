const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReturnbillsubSchema = new Schema({
    medical: {
        type: String,
    },
    product: {
        type: String,
    },
    invoiceId: {
        type: Number,
    },
    qty: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    returnqty: {
        type: String,
    },
    returnamt: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Returnbillsub = mongoose.model("returnbillsub", ReturnbillsubSchema);
module.exports = Returnbillsub;
