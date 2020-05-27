const { expect } = require('chai');
const express = require('express');
const app = express();
const session = require('./../../middleware/session');
const sessionValidator = require('./../../middleware/sessionValidator');
const cookieParser = require('cookie-parser');

const request = require('supertest');
const setCookie = require('set-cookie-parser');

const crypto = require('crypto');
const encryptString = require('./../../utils/encryptString');

describe('sessionValidator', () => {
	let cookieData = {};
	let cookies = [];
	const originalUserId = 'myVeryCoolId';

	const key = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16);

	before(() => {
		const cookieSecret = 'some_semi_permanent_secret';
		process.env.SESSION_SECRET = cookieSecret;
		app.use(cookieParser(cookieSecret));
		app.use(session);
		app.use(sessionValidator);

		app.get('/mock-session', (req, res) => {
			req.session.signedIn = true;
			req.session.email = 'email@example.com';
			req.session.name = 'Example User';

			req.session.encryptedUserId = encryptString(
				originalUserId,
				key,
				iv
			);

			const options = { signed: true, maxAge: 1000 * 86400 * 30 };

			res.cookie('decryptKey', key.toString('hex'), options);
			res.cookie('decryptIv', iv.toString('hex'), options);

			res.end();
		});
	});

	beforeEach(async () => {
		// reset our session values so that we're "signed in" again before each test
		const response = await request(app).get('/mock-session');

		cookieData = setCookie(response.headers['set-cookie'], {
			decodeValues: true,
			map: true
		});

		cookies = Object.keys(cookieData).map(
			name => `${name}=${cookieData[name].value}`
		);
	});

	describe('session checking', () => {
		before(() => {
			app.get('/check-session', (req, res) => {
				res.json({ signedIn: Boolean(req.session.signedIn) });
			});
		});

		it('should not affect session if all decryption and session cookies are valid', done => {
			request(app)
				.get('/check-session')
				.set('Cookie', cookies)
				.then(res => {
					expect(res.body.signedIn).to.be.true;
					done();
				});
		});

		it('should force session expiration if decryptKey cookie is changed', done => {
			const newCookies = cookies.map(cookieStr => {
				if (cookieStr.startsWith('decryptKey=')) {
					return `decryptKey=someIncorrectValue`;
				}
				return cookieStr;
			});

			request(app)
				.get('/check-session')
				.set('Cookie', newCookies)
				.then(res => {
					expect(res.body.signedIn).to.be.false;
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
				.get('/check-session')
				.set('Cookie', newCookies)
				.then(res => {
					expect(res.body.signedIn).to.be.false;
					done();
				});
		});
	});

	it('should add getDecryptedUserId method to session if signed in', done => {
		app.get('/decryptUserId', (req, res) => {
			res.json({ userId: req.session.getDecryptedUserId() });
		});

		request(app)
			.get('/decryptUserId')
			.set('Cookie', cookies)
			.then(res => {
				expect(res.body.userId).to.be.a('string');
				expect(res.body.userId).to.equal(originalUserId);
				done();
			});
	});

	describe('Voting Station', () => {
		it('should extend my session expiration on future requests if not a voting station', done => {
			setTimeout(() => {
				request(app)
					.get('/check-session')
					.set('Cookie', cookies)
					.then(res => {
						const newCookieData = setCookie(
							res.header['set-cookie'],
							{ decodeValues: true, map: true }
						);

						expect(
							newCookieData.decryptKey.expires.getTime()
						).to.be.gt(cookieData.decryptKey.expires.getTime());

						expect(
							newCookieData.decryptIv.expires.getTime()
						).to.be.gt(cookieData.decryptIv.expires.getTime());

						done();
					});
			}, 1000);
		});

		it('should not extend my session if a voting station cookie is present', done => {
			const newCookies = [...cookies, 'isVotingStation=true'];

			request(app)
				.get('/api/state')
				.set('Cookie', newCookies)
				.then(res => {
					const renewedCookieData = setCookie(
						res.header['set-cookie'],
						{ decodeValues: true, map: true }
					);

					expect(renewedCookieData).to.not.have.property(
						'decryptKey'
					);

					expect(renewedCookieData).to.not.have.property('decryptIv');

					done();
				});
		});
	});

	describe('NODE_ENV is production', () => {
		before(() => {
			process.env.NODE_ENV = 'production';
		});

		it('should deliver cookies with secure flag enabled and sameSite set to none', done => {
			request(app)
				.get('/api/state')
				.set('Cookie', cookies)
				.then(res => {
					const renewedCookieData = setCookie(
						res.header['set-cookie'],
						{ decodeValues: true, map: true }
					);

					expect(renewedCookieData.decryptKey.secure).to.be.true;
					expect(renewedCookieData.decryptIv.secure).to.be.true;

					expect(renewedCookieData.decryptKey.sameSite).to.equal(
						'None'
					);
					expect(renewedCookieData.decryptIv.sameSite).to.equal(
						'None'
					);

					done();
				});
		});
	});

	describe('NODE_ENV is not production', () => {
		before(() => {
			process.env.NODE_ENV = 'development';
		});

		it('should not explicitly declare ssl for cookies', done => {
			request(app)
				.get('/api/state')
				.set('Cookie', cookies)
				.then(res => {
					const renewedCookieData = setCookie(
						res.header['set-cookie'],
						{ decodeValues: true, map: true }
					);

					expect(renewedCookieData.decryptKey).to.not.have.property(
						'secure'
					);
					expect(renewedCookieData.decryptIv).to.not.have.property(
						'secure'
					);

					done();
				});
		});
	});
});
