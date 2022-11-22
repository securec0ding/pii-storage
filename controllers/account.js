const Health = require('../models/Health')
const Jog = require('../models/Jog')
const User = require('../models/User')

const accountHelp = require('../helpers/account')
const healthHelp = require('../helpers/health')


exports.register = (req, res, next) => {
  if (req.body.password !== req.body.passwordConf) {
    req.flash('error', "Passwords do not match.")
    return res.redirect('/register')
  } else if (req.body.email && req.body.password) {
    var userData = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    }
    User.create(userData, (err, user) => {
      if (err) {
        req.flash('error', "Registration error.")
        return res.redirect('/register')
      } else {
        req.session.userId = user._id
        return res.redirect('/dashboard')
      }
    })
  } else {
    req.flash('error', "Missing required fields.")
    return res.redirect('/register')
  }
}

exports.login = (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (err, user) => {
      if (err || !user) {
        req.flash('error', "Wrong email or password.")
        return res.redirect('/')
      } else {
        req.session.userId = user._id
        return res.redirect('/dashboard')
      }
    })
  } else {
    req.flash('error', "All fields required.")
    return res.redirect('/')
  }
}

exports.logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        req.flash('error', "Error logging out.")
      }
      return res.redirect('/')
    })
  }
}

exports.addJog = (req, res, next) => {
  if (req.body.distance && req.body.duration) {
    var jogData = {
      owner: req.user,
      date: new Date(),
      distance: req.body.distance,
      duration: req.body.duration,
      location: req.body.location,
      notes: req.body.notes,
    }
    Jog.create(jogData, (err, jog) => {
      if (err) {
        req.flash("Invalid input.")
        res.redirect('/dashboard')
      } else {
        req.user.jogs.push(jog)
        req.user.save((err, user) => {
          if (err) {
            req.flash("Failed to add jog.")
            res.redirect('/dashboard')
          } else {
            // Recalculate and store new health score
            var healthData = {
              owner: req.user,
              score: healthHelp.calculateHealth(req.user),
              date: new Date(),
            }
            Health.create(healthData, (err, health) => {
              return res.redirect('/dashboard')
            })
          }
        })
      }
    })
  } else {
    return next("Missing required field(s)")
  }
}

exports.updateSettings = (req, res, next) => {
  User.findById(req.user, (err, user) => {
    if (err) {
      req.flash('error', 'Update error.')
      return res.redirect('/settings')
    } else if (req.body.password) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err || !isMatch) {
          req.flash('error', 'Incorrect password.')
          return res.redirect('/settings')
        } else {
          return accountHelp.updateUser(user, req, res)
        }
      })
    } else {
      if (req.body.newPassword) {
        req.flash('error', 'Must include your current password.')
        return res.redirect('/settings')
      } else {
        return accountHelp.updateUser(user, req, res)
      }
    }
  })
}