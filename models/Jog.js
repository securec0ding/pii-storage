var mongoose = require('mongoose')

var Health = require('./Health')

var JogSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  distance: Number,
  duration: Number,
  location: String,
  notes: String,
})

var Jog = mongoose.model('Jog', JogSchema)
module.exports = Jog