'use strict'
var app = require('../app/api.js')
var expect = require('chai').expect
var request = require('supertest')

describe('CRUD', function () {
  this.timeout(0)

  describe('GET /scores', () => {
    it('responds with list of player scores', (done) => {
      request(app)
        .get('/scores')
        .expect(200, done)
    })
  })

  describe('GET /scores/:name', () => {
    it('responds with the score of player name Jared', done => {
      request(app)
        .get('/scores/Jared')
        .expect(200, (err, res) => {
          expect(res.body[0]).to.have.property('name', 'Jared')
          done(err)
        })
    })
    it('responds with 404 with nonexistant player name', done => {
      request(app)
        .get('/scores/akjhdahsddsfhasudh')
        .expect(404, done)
    })
  })

  describe('POST /scores', () => {
    // it('creates new document Monster with score 666', done => {
    //   request(app)
    //     .post('/scores')
    //     .send({"name": "Monster", "score": 666})
    //     .expect(200, (err, res) => {
    //       request(app)
    //         .get('/scores/Monster')
    //         .expect(200, (err, res) => {
    //           expect(res.body[0]).to.have.property('name', 'Monster')
    //           expect(res.body[0]).to.have.property('score', 666)
    //           if (err) done(err)
    //         })
    //         .del({"name": "Monster"})
    //         .end(done(err))
    //     })
    // })
  })

})

// describe('GET /', () => {
//   it('responds with list of student json', function (done) {
//     request(app)
//       .get('/')
//       .set('Content-Type', '/json/')
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err)
//         done()
//       })
//   })
// })
//
// describe('GET /students?name=Jared%20Tong', () => {
//   it('responds with only one student when searching by name', function (done) {
//     request(app)
//       .get('/students?name=Jared%20Tong')
//       .set('Content-Type', '/json/')
//       .expect((res) => {
//         console.log('Returns ' + res.body[0]['name'])
//         if (res.body[0]['name'] !== 'Jared Tong') throw new Error('Student Jared Tong Not Found')
//       })
//       .end((err, res) => {
//         if (err) return done(err)
//         done()
//       })
//   })
// })
//
// describe('GET /students?sort=desc', () => {
//   it('responds with an alphabetically sorted list', function (done) {
//     request(app)
//       .get('/students?sort=desc')
//       .set('Content-Type', '/json/')
//       .expect((res) => {
//         var lastItemIndex = res.body.length - 1
//         console.log('Name 1 ' + res.body[0]['name'])
//         if (res.body[0]['name'] !== 'Albert Salim') throw new Error('Albert is not First Name')
//         console.log('Name ' + lastItemIndex + ' ' + res.body[lastItemIndex]['name'])
//         if (res.body[lastItemIndex]['name'] !== 'Your Name Here') throw new Error('Your Name Here is not Last Name')
//       })
//       .end((err, res) => {
//         if (err) return done(err)
//         done()
//       })
//   })
//
//   it('responds with an ascending alphabetically sorted list', function (done) {
//     request(app)
//       .get('/students?sort=asc')
//       .set('Content-Type', '/json/')
//       .expect((res) => {
//         var lastItemIndex = res.body.length - 1
//         console.log('Name ' + lastItemIndex + ' ' + res.body[lastItemIndex]['name'])
//         if (res.body[lastItemIndex]['name'] !== 'Albert Salim') throw new Error('Albert is not First Name')
//         console.log('Name 1 ' + res.body[0]['name'])
//         if (res.body[0]['name'] !== 'Your Name Here') throw new Error('Your Name Here is not Last Name')
//       })
//       .end((err, res) => {
//         if (err) return done(err)
//         done()
//       })
//   })
// })
//
// describe('GET /search?sort=desc', () => {
//   it('responds with whitelisted field eg. githubURL', function (done) {
//     request(app)
//       .get('/students?type=githubURL')
//       .set('Content-Type', '/json/')
//       .expect((res) => {
//         console.log('Github URL at index 0: ' + res.body[0])
//         if (res.body[0] !== 'https://github.com/caalberts') throw new Error('caalberts github URL not found')
//       })
//       .end((err, res) => {
//         if (err) return done(err)
//         done()
//       })
//   })
// })
