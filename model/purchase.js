const mongoose = require("mongoose");
const { Schema } = mongoose;

const PurchaseDetailsSchema = new Schema({
  name: {
    type: String,
  },
  quantity: {
    type: String,
  },
  rate: {
    type: String,
  },
  party: {
    type: String,
  },
  expiry: {
    type: String,
  },
  totalamt: {
    type: String,
  },
  invoiceId: {
    type: Number,
  },
  sellingRate: {
    type: String,
  },
  mrp: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Purchasedetails = mongoose.model(
  "purchasedetails",
  PurchaseDetailsSchema
);
module.exports = Purchasedetails;
