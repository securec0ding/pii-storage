const router = require('express').Router()
const Jog = require('../models/Jog')

const authHelp = require('../helpers/auth')


router.get('/admin', authHelp.loginRequired, (req, res, next) => {
  Jog.find().sort({'date': -1}).populate('owner').exec((err, jogs) => {
    return res.render('admin', {
      title: 'Admin',
      jogs: jogs,
    })
  })
})

module.exports = router