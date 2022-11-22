const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const lusca = require('lusca')
const morgan = require('morgan')
const morganBody = require('morgan-body')

const User = require('./models/User')

const app = express()

app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))
morganBody(app, {noColors: true, prettify: false, maxBodyLength: 8000})

//use sessions for tracking logins
app.use(session({
  secret: 'SUPERSECRET',
  resave: true,
  saveUninitialized: false,
  cookie: {
  }
}))

mongoose.connect('mongodb://localhost:27017/jogtrax', {useMongoClient: true})

app.use(flash())
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  xssProtection: true,
  nosniff: true,
  referrerPolicy: 'same-origin',
}))

app.use((req, res, next) => {
  User.findById(req.session.userId).exec((err, user) => {
    res.locals.user = user
    next()
  })
})

var routes = require('./routes/router')
app.use('/', routes)

// error handler
app.use((err, req, res, next) => {
  req.flash('error', err.message)
  res.status(err.status || 500)
  return next()
})

app.listen(process.env.VIRTUAL_PORT, () => console.log('Server running...'))