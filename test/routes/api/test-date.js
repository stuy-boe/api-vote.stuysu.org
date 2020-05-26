const { expect } = require('chai');
const app = require('../../../app');
const request = require('supertest');

describe('/date', () => {
	it('should respond with status code 200', done => {
		dateRequest = request(app)
			.get('/api/date')
			.set('Accept', 'application/json')
			.expect(200, done);
	});

	it('should have a JSON body', done => {
		dateRequest = request(app)
			.get('/api/date')
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/, done);
	});

	it('should have a success property equal to true', done => {
		dateRequest = request(app)
			.get('/api/date')
			.set('Accept', 'application/json')
			.then(res => {
				expect(res.body.success).to.be.true;
				done();
			});
	});

	it('should have a payload property equal to an object', done => {
		dateRequest = request(app)
			.get('/api/date')
			.set('Accept', 'application/json')
			.then(res => {
				expect(res.body.payload).to.be.an('object');
				done();
			});
	});

	it('should have a valid date property in the payload', done => {
		dateRequest = request(app)
			.get('/api/date')
			.set('Accept', 'application/json')
			.then(res => {
				const date = new Date(res.body.payload.date);

				expect(date.getTime()).to.not.be.NaN;

				done();
			});
	});
});
