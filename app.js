'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('express-jwt')

const Photo = require('./models/photo.js')

const jwtCheck = jwt({
  secret: new Buffer(process.env.WAKEY_AUTH0_SECRET, 'base64'),
  audience: process.env.WAKEY_AUTH0_AUDIENCE
})

app.use(bodyParser.json({limit: '5mb'}))
app.use(cors())
app.use(express.static('public'))
app.use('/gallery', jwtCheck)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/' + 'app.html')
})

app.get('/gallery', (req, res) => {
  Photo.find(function (err, data) {
    if (err) {
      console.error(err)
      res.status(404).end(err)
      return
    }
  })
  .then(data => {
    res.json(data)
  })
})

app.post('/gallery', (req, res) => {
  const photoToUpload = new Photo(req.body)
  console.log('Request: ' + req.body.name)
  // console.log(req.body.url)
  photoToUpload.save(err => {
    if (err) res.status(404).end('Score Not Found')
    res.json(photoToUpload)
  })
})

app.use('*', (req, res) => {
  res.status(404).send('404')
})

module.exports = app
