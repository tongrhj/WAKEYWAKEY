const express = require('express')
const scoreboard = require('./dummyData/scores.json')
const bodyParser = require('body-parser')
const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/scores', (req, res) => {
  res.json(scoreboard)
})

app.get('/scores/:id', (req, res) => {
  const score = scoreboard[req.params.id]
  res.json(score)
})

// create
app.post('/scores', (req, res) => {
  const score = req.body
  scoreboard.push(score)
  res.json(score)
})

// update
app.put('/scores/:id', (req, res) => {
  scoreboard[req.params.id] = req.body
  res.json(scoreboard[req.params.id])
})

// delete
app.delete('/scores/:id', (req, res) => {
  delete scoreboard[req.params.id]
  res.send(scoreboard)
})

module.exports = app
