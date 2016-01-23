'use strict'

const express = require('express')
const app = express()
// const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('express-jwt')

import Photo from './data.js'

app.use(bodyParser.json())
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
})

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
