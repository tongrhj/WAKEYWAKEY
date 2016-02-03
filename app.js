'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('express-jwt')
// const path = require('path')
// const cloudinary = require('cloudinary')
// cloudinary.config({
//   cloud_name: 'tongrhj',
//   api_key: '473581557469736',
//   api_secret: 'TaywZ-zWEzJ_VShLbsjemcrQ9t0'
// })

const Photo = require('./data.js')

app.use(bodyParser.json({limit: '5mb'}))
app.use(cors())
app.use(express.static('public'))

const jwtCheck = jwt({
  secret: new Buffer(process.env.WAKEY_AUTH0_SECRET, 'base64'),
  audience: process.env.WAKEY_AUTH0_AUDIENCE
})

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
  // cloudinary.api.resources((items) => {
  //   res.render('index', { images: items.resources, cloudinary: cloudinary })
  // })
  // cloudinary.uploader.upload("http://www.example.com/image.jpg", function(result) {
  //   console.log(result)
  // })
  // console.log('Loading Gallery')
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

app.use('*', (req,res) => {
  res.status(404).send('404')
})

module.exports = app
