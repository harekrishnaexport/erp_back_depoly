const mongoose = require("mongoose");
const {Schema} = mongoose;

const MedicaldetailsSchema = new Schema({
  name: {
    type: String,
  },
  address: {
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

const Medicaldetails = mongoose.model("Medicaldetails", MedicaldetailsSchema);
module.exports = Medicaldetails;
