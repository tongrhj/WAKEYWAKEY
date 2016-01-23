var express = require('express')
var app = express()
var fetch = require('node-fetch')
// var babel_polyfill = require('babel-polyfill')

// Express Server Assignment Requirements
// should respond with JSON data
// should provide a list of all class participants
// should allow searching by name
// should allow sorting alphabetically by name
// should allow whitelisting specific fields

// Easier ways to do this: express-api- query handler

app.get('/', function (req, respond) {
  fetch('https://raw.githubusercontent.com/jsstrn/ga-wdi-class/gh-pages/js/data.json')
    // should respond with JSON data
    .then(res => {
      // if (res.ok && res.headers.get("content-type") === "application/json")  { return res.json() }
      if (res.ok && res.headers.get('content-type') === 'text/plain; charset=utf-8') {
        return res.json()
      } else {
        throw new Error('ERROR')
      }
    })
    // Returns a list comprising only student names
    // .then(res => {
    //   var listOfStudentNames = res.students.map((student) => student.name)
    //   return listOfStudentNames
    // })
    .then(res => {
      respond.send(res)
    })
})

app.get('/search', function (req, respond) {
  fetch('https://raw.githubusercontent.com/jsstrn/ga-wdi-class/gh-pages/js/data.json')
    // should respond with JSON data
    .then(res => {
      // if (res.ok && res.headers.get("content-type") === "application/json")  { return res.json() }
      if (res.ok && res.headers.get('content-type') === 'text/plain; charset=utf-8') {
        return res.json()
      } else {
        throw new Error('ERROR')
      }
    })
    .then(res => {
      var listOfStudents = res.students
      return listOfStudents
    })
    // Search for Name
    .then(res => {
      if (req.query.name) {
        var searchResult = res.filter((student) => { return student.name === req.query.name })
        return searchResult
      } else {
        return res
      }
    })
    // Search by Type
    .then(res => {
      if (req.query.type) {
        var searchResult = res.map((student) => student[req.query.type])
        return searchResult
      } else {
        return res
      }
    })
    // Sort alphabetically
    .then(res => {
      var sortedList
      if (req.query.sort === 'desc') {
        sortedList = res.sort((a, b) => a.name.localeCompare(b.name))
        return sortedList
      } else if (req.query.sort) {
        sortedList = res.sort((a, b) => a.name.localeCompare(b.name) * -1)
        return sortedList
      } else {
        return res
      }
    })
    .then(res => {
      respond.send(res)
    })
})

// export default app
module.exports = app
