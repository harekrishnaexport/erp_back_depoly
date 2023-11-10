const mongoose = require('mongoose')
const { Schema } = mongoose

if (mongoose.models['dk']) {
  delete mongoose.models['dk'];
  // delete mongoose.modelSchemas['dk'];
}

const CountSchema = new Schema({
  
  titles:{
    type:String,
  },
  id:{
    type:Number,
  }
}) 

const Countermodle = mongoose.model('dk',CountSchema)
module.exports = Countermodle;