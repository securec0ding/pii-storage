var mongoose = require('mongoose')

var HealthSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  date: Date,
})

var Health = mongoose.model('Health', HealthSchema)
module.exports = Health