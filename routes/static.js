const router = require('express').Router()
const User = require('../models/User')


router.get('/', (req, res, next) => {
  User.findById(req.session.userId).exec((err, user) => {
    if (err || !user) {
      return res.render('index', {title: 'Welcome'})
    } else {
      return res.redirect('/dashboard')
    }
  })
})

router.get('/about', (req, res, next) => {
  return res.render('about', {title: 'About'})
})

router.get('/terms', (req, res, next) => {
  return res.render('terms', {title: 'Terms & Conditions'})
})

module.exports = router