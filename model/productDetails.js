const mongoose = require("mongoose");
const {Schema} = mongoose;

const ProductDetailsSchema = new Schema({
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

const productdetails = mongoose.model("productdetails", ProductDetailsSchema);
module.exports = productdetails;
