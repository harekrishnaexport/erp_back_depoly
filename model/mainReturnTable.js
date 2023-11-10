const mongoose = require("mongoose");
const { Schema } = mongoose;

const MainReturnTableSchema = new Schema({
  medical: {
    type: String,
  },
  salesmen: {
    type: String,
  },
  invoiceId: {
    type: Number,
  },
  returnamt: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Mainreturntable = mongoose.model(
  "mainreturntable",
  MainReturnTableSchema
);
module.exports = Mainreturntable;
