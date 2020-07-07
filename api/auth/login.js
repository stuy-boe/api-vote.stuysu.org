const router = require('express').Router();

const encryptString = require('../../utils/encryptString');
const randomString = require('crypto-random-string');
const crypto = require('crypto');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const RequestRefusalError = require('../../utils/RequestRefusalError');

router.get('/', (req, res, next) => {
	req.idToken = req.query.idToken;
	next();
});

router.post('/', (req, res, next) => {
	req.idToken = req.body.idToken;
	next();
});

router.use('/', async (req, res) => {
	const idToken = req.idToken;
	const isVotingStation = Boolean(req.cookies.isVotingStation);

	let payload;

	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID
		});

		payload = ticket.getPayload();
	} catch (e) {
		throw new RequestRefusalError(
			'The provided login token was invalid.',
			'INVALID_ID_TOKEN'
		);
	}

	if (req.session.signedIn) {
		throw new RequestRefusalError(
			'You are already signed in.',
			'SIGNED_IN'
		);
	}

	if (!payload.email_verified) {
		throw new RequestRefusalError(
			'That email is not verified and cannot be used for sign in.',
			'UNVERIFIED_EMAIL'
		);
	}

	if (
		payload.azp !== process.env.GOOGLE_CLIENT_ID ||
		payload.aud !== process.env.GOOGLE_CLIENT_ID
	) {
		throw new RequestRefusalError(
			'That login token was not generated for this app and cannot be used.',
			'INVALID_ID_TOKEN'
		);
	}

	// Create session now that info has been validated
	// Generate a random key and salt to encrypt the user's sub (secret user id)
	const encryptKey = crypto.randomBytes(32);
	const encryptIv = crypto.randomBytes(16);

	const maxAge = isVotingStation ? 1000 * 60 * 5 : 1000 * 86400 * 30;

	// Create a user cookie to store the information needed to decrypt the user id
	// The decryption keys only exist on the user side
	const options = {
		maxAge, // Normal cookie lasts for 30 days, voting station lasts 5 min
		httpOnly: true, // The cookie only accessible by the web server
		signed: true // Indicates if the cookie should be signed
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
		options.sameSite = 'none';
	}

	req.session.signedIn = true;
	req.session.email = payload.email;
	req.session.name = payload.name;
	req.session.cookie.expires = new Date(new Date().getTime() + maxAge);
	req.session.encryptedUserId = encryptString(
		payload.sub,
		encryptKey,
		encryptIv
	);

	res.cookie('decryptKey', encryptKey.toString('hex'), options);
	res.cookie('decryptIv', encryptIv.toString('hex'), options);
	res.cookie('session', req.sessionID, options);

	if (req.query.redirect) {
		res.redirect(req.query.redirect);
	} else {
		res.json({ success: true });
	}
});

module.exports = router;
