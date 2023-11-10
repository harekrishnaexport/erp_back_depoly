const mongoose = require("mongoose");
const {Schema} = mongoose;

const SalesmendetailsSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  date: {
    type: Date,
		default: Date.now
  }
});

const Salesmendetails = mongoose.model("salesmendetails", SalesmendetailsSchema);
module.exports = Salesmendetails;
