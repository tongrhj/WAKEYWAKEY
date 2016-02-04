import expect from 'chai'
import request from 'supertest'
import mongoose from 'mongoose'

import app from '../app.js'

describe('Routes', () => {
  describe('/', () => {
    it('should return status OK', (done) => {
      request(app)
        .get('/')
        .expect(200)
    })
  })
})
