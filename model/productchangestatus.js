const mongoose = require("mongoose");
const {Schema} = mongoose;

const ProductDetailsByupdateSchema = new Schema({
  product_ref:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'productdetails'
  },
  name: {
    type: String,
  },
  quantity: {
    type: String,
  },
  rate: {
    type: String,
  },
  mrp: {
    type: String,
  },
  expiry: {
    type: String,
  },
  date: {
    type: Date,
		default: Date.now
  }
});

const productdetailsSeperate = mongoose.model("productdetails_month", ProductDetailsByupdateSchema);
module.exports = productdetailsSeperate;
