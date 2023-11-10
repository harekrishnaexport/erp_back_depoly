const mongoose = require("mongoose");
const {Schema} = mongoose;

const MainPaymentSchema = new Schema({
  totalamount: {
    type: Number,
  },
  receiveamount: {
    type: String,
  },
  status: {
    type: String,
  },
  medical: {
    type: String,
  },
  invoiceId: {
    type: String,
  },
  salesmen :{
    type: String
  },
  returnamt :{
    type: Number
  },
  date: {
    type: Date,
		default: Date.now
  }
});

const MainpaymentDetails = mongoose.model("mainpayment", MainPaymentSchema);
module.exports = MainpaymentDetails;
