const mongoose = require("mongoose");
const {Schema} = mongoose;

const ProfileDetailsSchema = new Schema({
  bankname: {
    type: String,
  },
  account: {
    type: String,
  },
  holdername: {
    type: String,
  },
  ifsc: {
    type: String,
  },
  comname: {
    type: String,
  },
  comnumber: {
    type: String,
  },
  date: {
    type: Date,
		default: Date.now
  }
});

const Profiledetails = mongoose.model("profiledetails", ProfileDetailsSchema);
module.exports = Profiledetails;
