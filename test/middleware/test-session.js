const { expect } = require('chai');
const express = require('express');
const request = require('supertest');
const setCookie = require('set-cookie-parser');
const cookieParser = require('cookie-parser');
const app = express();

describe('session', () => {
	before(() => {
		process.env.SESSION_SECRET = 'some_semi_permanent_secret';
		const session = require('./../../middleware/session');

		app.use(cookieParser(process.env.SESSION_SECRET));
		app.use(session);
		app.get('/initializeSession', (req, res) => {
			req.session.initialized = true;
			res.end();
		});
	});

	it('should be accessible from the req object', done => {
		app.get('/testForSession', (req, res) => {
			expect(req).to.have.property('session');
			res.end();
		});

		request(app).get('/testForSession').expect(200, done);
	});

	describe('setting cookies', () => {
		it('should send set-cookie header for new sessions', done => {
			request(app)
				.get('/initializeSession')
				.then(res => {
					const cookies = setCookie(res.header['set-cookie'], {
						decodeValues: true,
						map: true
					});

					expect(cookies).to.have.property('session');
					done();
				});
		});
	});
});
