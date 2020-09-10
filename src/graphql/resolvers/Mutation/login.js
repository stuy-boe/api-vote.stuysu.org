const { ForbiddenError, ApolloError } = require('apollo-server-errors');
const mongoose = require('mongoose');
const { GOOGLE_CLIENT_ID } = require('../../../constants');
const { sign } = require('jsonwebtoken');
const { COOKIE_SECRET, NODE_ENV } = require('../../../constants');
const User = mongoose.model('User');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

module.exports = async (root, { idToken }, { jwt, cookies, res }) => {
	if (jwt) {
		throw new ForbiddenError('You are already signed in.');
	}

	let payload;

	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: GOOGLE_CLIENT_ID
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

	if (payload.azp !== GOOGLE_CLIENT_ID || payload.aud !== GOOGLE_CLIENT_ID) {
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

	const token = sign(
		{
			user: {
				id: user._id,
				sub: payload.sub
			},
			audience: 'vote.stuysu.org',
			issuer: 'vote.stuysu.org'
		},
		COOKIE_SECRET,
		{ expiresIn: isVotingStation ? 5 * 60 : '14d' }
	);

	res.cookie('auth-jwt', token);

	return token;
};
