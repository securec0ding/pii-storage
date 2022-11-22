const router = require('express').Router()
const csv = require('csv-express')

const Health = require('../models/Health')
const Jog = require('../models/Jog')
const User = require('../models/User')

const apiController = require('../controllers/api')

const authHelp = require('../helpers/auth')
const healthHelp = require('../helpers/health')


router.get('/locations', authHelp.loginRequired, (req, res, next) => {
  Jog.find().distinct('location', (err, locations) => {
    return res.send(locations)
  })
})

router.get('/history', authHelp.loginRequired, (req, res, next) => {
  Health.find({owner: req.user}, (err, healthScores) => {
    return res.render('history', {
      title: 'Your Jogs',
      jogs: req.user.jogs.sort((a,b) => { return a.date < b.date }),
      healthScores: healthScores,
    })
  })
})

router.get('/health', authHelp.loginRequired, (req, res, next) => {
  return healthHelp.describeHealth(req.user, res)
})

router.get('/stats', authHelp.loginRequired, (req, res, next) => {
  Jog.aggregate([{
      $group: {
        _id: "$location",
        count: { $sum: 1 },
      }
    }]).sort({'count': -1}).limit(1).exec((err, jogLoc) => {

    Jog.aggregate([{
        $group: {
          _id: null,
          total: { $sum: '$distance' },
        }
      }], (err, jogStats) => {

      Jog.aggregate([{
          $group: {
            _id: '$owner',
            totalDistance: { $sum: '$distance' },
            totalDuration: { $sum: '$duration' },
          },
        }]).sort({totalDistance: -1}).limit(3).exec((err, jogs) => {

        User.populate(jogs, '_id', function(err, joggers) {
          return res.render('stats', {
            title: 'Stats',
            topJoggers: joggers,
            totalDistance: jogStats.length ? jogStats[0].total : null,
            popularLocation: jogLoc ? jogLoc[0]._id : null,
          })
        })
      })
    })
  })
})

router.get('/export', authHelp.loginRequired, (req, res, next) => {
  Jog.find({owner: req.user}, (err, jogs) => {
    data = jogs.map(jog => {
      return {
        date: jog.date.toLocaleDateString(),
        distance: jog.distance + ' kms',
        duration: jog.duration + ' minutes',
        location: jog.location,
        notes: jog.notes,
      }
    })
    return res.csv(data, true)
  })
})

router.post('/remove', authHelp.loginRequired, (req, res, next) => {
  return apiController.deleteRecord(req, res)
})

module.exports = router