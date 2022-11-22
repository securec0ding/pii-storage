const Health = require('../models/Health')
const Jog = require('../models/Jog')
const User = require('../models/User')


exports.deleteRecord = (req, res, next) => {
  var recordMatch = {_id: req.body.objId}

  var RecordType;
  if (req.body.objType == 'user') {
    RecordType = User
  } else {
    recordMatch.owner = req.user

    if (req.body.objType == 'jog') {
      RecordType = Jog
    } else if (req.body.objType == 'score') {
      RecordType = Health
    }
  }

  RecordType.findOne(recordMatch, (err, record) => {
    if (err || !record) {
      return res.status(404).send()
    } else {
      record.remove().then((record) => {
        return res.status(204).send()
      }).catch((err) => {
        return res.status(500).send()
      })
    }
  })
}