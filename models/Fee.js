const mongoose = require('mongoose')

const feeSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  currency: String,
  locale: String,
  entity: String,
  entityProperty: String,
  type: String,
  value: String,
})

module.exports = mongoose.model('Fee', feeSchema)
