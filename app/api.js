'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('express-jwt')
// const cloudinary = require('cloudinary')
// cloudinary.config({
//   cloud_name: 'tongrhj',
//   api_key: '473581557469736',
//   api_secret: 'TaywZ-zWEzJ_VShLbsjemcrQ9t0'
// })

import Photo from './data.js'

app.use(bodyParser.json({limit: '5mb'}))
app.use(cors())
app.use(express.static('public'))

const jwtCheck = jwt({
  secret: new Buffer(process.env.SCOREBOARD_AUTH0_SECRET, 'base64'),
  audience: process.env.SCOREBOARD_AUTH0_AUDIENCE
})

// app.use('/gallery', jwtCheck)

// mongoose.connect('mongodb://' + process.env.IWULT_MONGODB_USER + ':' + process.env.IWULT_MONGODB_PASSWORD + '@ds047950.mongolab.com:47950/iwult-app')

// const Photos = mongoose.model('Picture', {
//   name: String,
//   id: Number
// })

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
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

// app.post('/upload', (req, res) => {
//   const photoToUpload = new Photo(req.body)
//   photoToUpload.save(err => {
//     if (err) res.status(404).end('Score Not Found')
//     res.json(photoToUpload)
//   })
// })

// app.get('/scores', (req, res) => {
//   PlayerScore
//     .find(function (err, data) {
//       if (err) {
//         console.error(err)
//         res.status(404).end(err)
//         return
//       }
//     })
//     .sort({ score: -1 })
//     .then(data => {
//       res.json(data)
//     })
// })
//
// app.get('/scores/:name', (req, res) => {
//   PlayerScore.find({ name: req.params.name }, (err, data) => {
//     if ((err) || !data.length) { res.status(404).end('Score Not Found') }
//   })
//   .then(data => { res.json(data) })
// })
//
// // create
// app.post('/scores', (req, res) => {
//   const score = new PlayerScore(req.body)
//   score.save(err => {
//     if (err) res.status(404).end('Score Not Found')
//     res.json(score)
//   })
// })
//
// // update
// app.put('/scores/:name/:score', (req, res) => {
//   PlayerScore.findOneAndUpdate({ name: req.params.name }, req.body, { new: true }, (err, data) => {
//     if (err) {
//       return console.error(err)
//     } else if (data) {
//       console.log('Updated', JSON.stringify(data))
//       res.json(data)
//     } else {
//       console.log('Not Found')
//       res.status(404).end('Score not found')
//     }
//   })
// })
//
// // delete
// app.delete('/scores', (req, res) => {
//   PlayerScore.findOneAndRemove({ name: req.body.name }, (err, data) => {
//     if (err) return console.error(err)
//     res.json(data)
//   })
// })

module.exports = app
