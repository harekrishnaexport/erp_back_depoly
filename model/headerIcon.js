const mongoose = require('mongoose')
const { Schema } = mongoose

const HeaderIconSchema = new Schema({
  title: {
    type: String,
  },
  id: {
    type: Number,
  }
})

const HeaderIcon = mongoose.model('headericon', HeaderIconSchema)
module.exports = HeaderIcon;