const { expect } = require('chai');
const app = require('../../app');
const request = require('supertest');
const setCookie = require('set-cookie-parser');

const crypto = require('crypto');
const encryptString = require('./../../utils/encryptString');

describe('sessionValidator', () => {
	let cookies = [];
	const originalUserId = 'myVeryCoolId';

	const key = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16);

	before(() => {
		process.env.SESSION_SECRET = 'some_semi_permanent_secret';

		app.get('/mock-session', (req, res) => {
			req.session.signedIn = true;
			req.session.email = 'email@example.com';
			req.session.name = 'Example User';

			req.session.encryptedUserId = encryptString(
				originalUserId,
				key,
				iv
			);

			const options = {
				signed: true
			};

			res.cookie('decryptKey', key.toString('hex'), options);
			res.cookie('decryptIv', iv.toString('hex'), options);

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

	it('should add getDecryptedUserId method to session if signed in', done => {
		app.get('/testUserIdDecryption', (req, res) => {
			res.send(req.session.getDecryptedUserId());
		});

		request(app)
			.get('/testUserIdDecryption')
			.set('Cookie', cookies)
			.then(res => {
				expect(res.text).to.equal(originalUserId);
				done();
			});
	});
});
