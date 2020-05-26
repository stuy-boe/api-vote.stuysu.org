const { expect } = require('chai');
const app = require('../../app');
const request = require('supertest');

describe('cors', () => {
	let stateRequest;
	beforeEach(() => {
		stateRequest = request(app)
			.get('/api/state')
			.set('Accept', 'application/json');
	});

	describe('development environment', () => {
		process.env.NODE_ENV = 'development';

		it('should respond to state requests with status code 200', done => {
			stateRequest.expect('Content-Type', /json/).expect(200, done);
		});
	});

	describe('production environment with only localhost origin allowed', () => {
		process.env.NODE_ENV = 'production';
		process.env.ALLOWED_ORIGINS = 'http://localhost:3000';

		it('should respond to state requests from localhost with status code 200', done => {
			stateRequest
				.set('origin', 'http://localhost:3000')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

		it('should respond to state requests from invalid origins with a status code 403', done => {
			stateRequest
				.set('origin', 'http://example.com')
				.expect('Content-Type', /json/)
				.expect(403, done);
		});
	});
});
