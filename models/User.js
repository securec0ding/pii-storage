var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  jogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jog' }],
}, { usePushEach: true })

UserSchema.statics.authenticate = (email, password, cb) => {
  User.findOne({ email: email }).exec((err, user) => {
    if (err) {
      return cb(err)
    } else if (!user) {
      var err = new Error('User not found.')
      err.status = 401
      return cb(err)
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) {
        return cb(null, user)
      } else {
        return cb()
      }
    })
  })
}

UserSchema.pre('save', function(next) {
  var user = this
  if (user.isModified('password')) {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  } else next()
})

UserSchema.methods.comparePassword = function comparePassword(newPwd, cb) {
  bcrypt.compare(newPwd, this.password, (err, isMatch) => {
    cb(err, isMatch)
  })
}

var User = mongoose.model('User', UserSchema)
module.exports = User