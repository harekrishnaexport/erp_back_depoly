const mongoose = require("mongoose");
const {Schema} = mongoose;

const MainPurchaseSchema = new Schema({
    totalamt: {
    type: Number,
  },
  party: {
    type: String,
  },
  invoiceId: {
    type: Number,
  },
  date: {
    type: Date,
		default: Date.now
  }
});

const MainPurchasetable = mongoose.model("mainpurchase", MainPurchaseSchema);
module.exports = MainPurchasetable;
