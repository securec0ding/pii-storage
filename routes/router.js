const router = require('express').Router()

router.use('/', require('./account'))
router.use('/', require('./admin'))
router.use('/', require('./data'))
router.use('/', require('./static'))

router.get('*', (req, res, next) => {
  return res.redirect('/')
})

module.exports = router