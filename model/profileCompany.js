const mongoose = require("mongoose");
const {Schema} = mongoose;

const ProfileCompanySchema = new Schema({

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

const CompanyDetail = mongoose.model("companydetail", ProfileCompanySchema);
module.exports = CompanyDetail;
