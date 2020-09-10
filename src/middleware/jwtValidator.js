const { ForbiddenError } = require('apollo-server-errors');

const { verify } = require('jsonwebtoken');
const { COOKIE_SECRET } = require('../constants');
const mongoose = require('mongoose');
const User = mongoose.model('User');

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

	let user = null;

	req.getUser = async () => {
		if (!user && req.jwt) {
			user = await User.findById(req.jwt.user.id);
		}

		return user;
	};

	req.authenticationRequired = fields => {
		if (!req.jwt) {
			if (fields) {
				throw new ForbiddenError(
					'You need to be signed in to access one or more fields: ' +
						fields.join(', ')
				);
			}

			throw new ForbiddenError(
				'You need to be signed in to perform this action.'
			);
		}
	};

	req.adminRoleRequired = async (role, fields) => {
		const user = await req.getUser();

		if (!user?.adminRoles?.includes(role)) {
			if (fields) {
				throw new ForbiddenError(
					'You do not have permission to access one or more fields: ' +
						fields.join(', ')
				);
			}

			throw new ForbiddenError(
				"You don't have permission to perform this action."
			);
		}
	};

	req.candidateManagerRequired = async (candidateId, fields) => {
		const user = await req.getUser();

		if (!user?.managesCandidates?.includes(candidateId)) {
			if (fields) {
				throw new ForbiddenError(
					'You do not have permission to access one or more fields: ' +
						fields.join(', ')
				);
			}

			throw new ForbiddenError(
				"You don't have permission to perform this action."
			);
		}
	};

	next();
};

module.exports = jwtValidator;
