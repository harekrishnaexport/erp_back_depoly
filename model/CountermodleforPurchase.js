const mongoose = require('mongoose')
const { Schema } = mongoose

if (mongoose.models['purchasecount']) {
  delete mongoose.models['purchasecount'];
  // delete mongoose.modelSchemas['dk'];
}

const CountermodleforPurchaseSchema = new Schema({
  
  titles:{
    type:String,
  },
  id:{
    type:Number,
  }
}) 

const CountermodleforPurchase = mongoose.model('purchasecount',CountermodleforPurchaseSchema)
module.exports = CountermodleforPurchase;