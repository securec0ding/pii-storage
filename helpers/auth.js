const User = require('../models/User')

exports.loginRequired = (req, res, next) => {
  User.findById(req.session.userId).populate('jogs').exec((err, user) => {
    if (err || !user) {
      req.flash('error', "Please log in.")
      return res.redirect('/')
    } else {
      req.user = user
      return next()
    }
  })
}