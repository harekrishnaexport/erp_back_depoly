const mongoose = require("mongoose");
const { Schema } = mongoose;

const MainBilltableSchema = new Schema({
  medical: {
    type: String,
  },
  invoiceId: {
    type: Number,
  },
  totalamt: {
    type: Number,
  },
  receiveamt: {
    type: Number,
  },
  lessamount: {
    type: Number,
  },
  status: {
    type: Boolean,
    default: false,
  },
  pendingamount: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  salesmen: {
    type: String,
  },
  returnstatus: {
    type: Boolean,
    default: false,
  },
  returnamt: {
    type: Number,
  },
  discount: {
    type: String
  },
  totalPayable: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const MainBilltable = mongoose.model("mainbilltable", MainBilltableSchema);
module.exports = MainBilltable;
