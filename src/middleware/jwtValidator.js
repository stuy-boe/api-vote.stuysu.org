const { verify } = require('jsonwebtoken');
const { COOKIE_SECRET } = require('../constants');

const jwtValidator = async (req, res, next) => {
	let token =
		req.cookies['auth-jwt'] ||
		req.headers['x-access-token'] ||
		req.headers['authorization']; // Express headers are auto converted to lowercase

	req.jwt = null;

	if (token) {
		if (token.startsWith('Bearer ')) {
			token = token.replace('Bearer ', '');
		}

		try {
			req.jwt = await verify(token, COOKIE_SECRET);
		} catch (er) {
			req.jwt = null;
		}
	}

	next();
};

module.exports = jwtValidator;
