const router = require('express').Router()

const accountController = require('../controllers/account')
const authHelp = require('../helpers/auth')


router.post('/', (req, res, next) => {
  return accountController.login(req, res, next)
})

router.get('/logout', (req, res, next) => {
  accountController.logout(req, res, next)
})

router.get('/register', (req, res, next) => {
  return res.render('register', {title: 'Register'})
})

router.post('/register', (req, res, next) => {
  accountController.register(req, res, next)
})

router.get('/dashboard', authHelp.loginRequired, (req, res, next) => {
  return res.render('dashboard', {
    title: 'Your Jogs',
    user: req.user,
    lastJog: req.user.jogs ? req.user.jogs[req.user.jogs.length-1] : null,
  })
})

router.get('/settings', authHelp.loginRequired, (req, res, next) => {
  return res.render('settings', {
    title: 'Your Settings',
    user: req.user,
  })
})

router.post('/jog', authHelp.loginRequired, (req, res, next) => {
  accountController.addJog(req, res, next)
})

router.post('/settings', authHelp.loginRequired, (req, res, next) => {
  accountController.updateSettings(req, res, next)
})

module.exports = router