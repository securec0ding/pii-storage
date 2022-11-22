const Health = require('../models/Health')


exports.calculateHealth = (user) => {
  var weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  var recentJogs = user.jogs.filter(jog => jog.date > weekAgo)
  return recentJogs.length
}

exports.describeHealth = (user, res) => {
  Health.find({owner: user}).sort({date: -1}).limit(1).exec((err, health) => {
    if (health > 2) {
      return res.send("Great!")
    } else if (health > 0) {
      return res.send("Pretty good.")
    } else {
      return res.send("Fading. Get jogging...")
    }
  })
}