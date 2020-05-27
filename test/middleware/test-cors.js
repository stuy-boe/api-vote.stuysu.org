const {expect} = require('chai');
const express = require('express');
const app = express();
const cors = require('./../../middleware/cors');
const request = require('supertest');
const RequestRefusalError = require('./../../utils/RequestRefusalError');

describe('cors', () => {
  before(() => {
    app.use('*', cors);
    app.get('/', (req, res) => { res.send('success'); });
  });

  describe('development environment', () => {
    process.env.NODE_ENV = 'development';

    it('should allow requests to pass',
       done => { request(app).get('/').expect(200, done); });
  });

  describe('production environment with only localhost origin allowed', () => {
    before(() => {
      process.env.NODE_ENV = 'production';
      process.env.ALLOWED_ORIGINS = 'http://localhost:3000';
      process.env.SEQUELIZE_URL = 'sqlite::memory';
    });

    it('should allow requests from allowed origins to pass', done => {
      request(app)
          .get('/')
          .set('origin', 'http://localhost:3000')
          .expect(200, done);
    });

    it('should throw a RequestRefusalError if an invalid origin tries to access',
       done => {
         // Error handler to catch the cors error
         app.use((err, req, res, next) => {
           expect(err).to.be.instanceOf(RequestRefusalError);
           expect(err.code).to.equal('INVALID_ORIGIN');
           expect(err.message).to.equal('Not allowed by CORS');
           res.status(403).end();
         });

         request(app)
             .get('/')
             .set('origin', 'http://example.com')
             .expect(403, done);
       });
  });
});
