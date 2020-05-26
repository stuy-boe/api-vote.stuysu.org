const { expect } = require('chai');
const app = require('../../../app');
const request = require('supertest');

describe('/api/date', () => {
	let dateRequest;

	beforeEach(() => {
		dateRequest = request(app)
			.get('/api/date')
			.set('Accept', 'application/json');
	});

	it('should respond with status code 200', done => {
		dateRequest.expect(200, done);
	});

	it('should have a JSON body', done => {
		dateRequest.expect('Content-Type', /json/, done);
	});

	it('should have a success property equal to true', done => {
		dateRequest.then(res => {
			expect(res.body.success).to.be.true;
			done();
		});
	});

	it('should have a payload property equal to an object', done => {
		dateRequest.then(res => {
			expect(res.body.payload).to.be.an('object');
			done();
		});
	});

	it('should have a valid date property in the payload', done => {
		dateRequest.then(res => {
			const date = new Date(res.body.payload.date);

			expect(date.getTime()).to.not.be.NaN;

			done();
		});
	});
});
