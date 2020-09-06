const { ForbiddenError, ApolloError } = require('apollo-server-errors');
const encryptString = require('../../../utils/encryptString');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = async (
	root,
	{ idToken },
	{ session, cookies, res, sessionId }
) => {
	if (session.signedIn) {
		throw new ForbiddenError('You are already signed in.');
	}

	let payload;

	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID
		});

		payload = ticket.getPayload();
	} catch (e) {
		throw new ForbiddenError('The provided login token was invalid.');
	}

	if (!payload.email_verified) {
		throw new ForbiddenError(
			'That email is not verified and cannot be used for sign in.'
		);
	}

	if (
		payload.azp !== process.env.GOOGLE_CLIENT_ID ||
		payload.aud !== process.env.GOOGLE_CLIENT_ID
	) {
		throw new ForbiddenError(
			'That login token was not generated for this app and cannot be used.',
			'INVALID_ID_TOKEN'
		);
	}

	const email = payload.email;
	const user = await User.findOne({ email })
		.sort({ gradYear: 'desc' })
		.exec();

	if (!user) {
		throw new ApolloError(
			'Your email address is not in the database. Contact stuyboe@gmail.com if you think this is a mistake.'
		);
	}

	const isVotingStation = Boolean(cookies.isVotingStation);

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

	session.signedIn = true;
	session.userId = user._id;
	session.cookie.expires = new Date(new Date().getTime() + maxAge);
	session.encryptedSub = encryptString(payload.sub, encryptKey, encryptIv);

	res.cookie('decryptKey', encryptKey.toString('hex'), options);
	res.cookie('decryptIv', encryptIv.toString('hex'), options);
	res.cookie('session', sessionId, options);

	return user;
};
