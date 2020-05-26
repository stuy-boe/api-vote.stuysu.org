const { expect } = require('chai');
const app = require('../../app');
const request = require('supertest');
const setCookie = require('set-cookie-parser');

describe('sessionValidator', () => {
	let cookies = [];

	before(() => {
		process.env.SESSION_SECRET = 'some_semi_permanent_secret';

		app.get('/mock-session', (req, res) => {
			req.session.signedIn = true;
			req.session.email = 'email@example.com';
			req.session.name = 'Example User';
			const options = {
				signed: true
			};
			res.cookie('decryptIv', 'test', options);
			res.cookie('decryptKey', 'test', options);
			res.end();
		});
	});

	beforeEach(async () => {
		// reset our session values so that we're "signed in" again before each test
		const response = await request(app).get('/mock-session');
		cookies = setCookie(response.headers['set-cookie'], {
			decodeValues: true
		}).map(cookie => `${cookie.name}=${cookie.value}`);
	});

	it('should not affect session if all decryption and session cookies are valid', done => {
		request(app)
			.get('/api/state')
			.set('Cookie', cookies)
			.set('Accept', 'application/json')
			.then(res => {
				expect(res.body.payload.signedIn).to.be.true;
				done();
			});
	});

	it('should log me out if decryptKey cookie is changed', done => {
		const newCookies = cookies.map(cookieStr => {
			if (cookieStr.startsWith('decryptKey=')) {
				return `decryptKey=someIncorrectValue`;
			}
			return cookieStr;
		});
		request(app)
			.get('/api/state')
			.set('Cookie', newCookies)
			.set('Accept', 'application/json')
			.then(res => {
				expect(res.body.payload.signedIn).to.be.false;
				done();
			});
	});

	it('should log me out if decryptIv cookie is changed', done => {
		const newCookies = cookies.map(cookieStr => {
			if (cookieStr.startsWith('decryptIv=')) {
				return `decryptIv=someIncorrectValue`;
			}
			return cookieStr;
		});

		request(app)
			.get('/api/state')
			.set('Cookie', newCookies)
			.set('Accept', 'application/json')
			.then(res => {
				expect(res.body.payload.signedIn).to.be.false;
				done();
			});
	});
});
