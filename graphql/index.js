const {
	ApolloServer,
	ApolloError,
	ValidationError
} = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const models = require('../database');

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		return {
			session: req.session,
			models
		};
	},
	introspection: true,
	playground: {
		settings: {
			'request.credentials': 'same-origin'
		}
	},
	formatError: err => {
		const safeError =
			err.originalError instanceof ApolloError ||
			err instanceof ValidationError ||
			err.originalError.message === 'Not allowed by CORS';

		// This is an unexpected error and might have secrets
		if (!safeError) {
			console.log(err);

			return new Error('There was an unknown error on the server');
		}

		// Might want to hide the stack trace for security in production
		if (
			process.env.NODE_ENV === 'production' &&
			err.extensions &&
			err.extensions.exception &&
			err.extensions.exception.stacktrace
		) {
			delete err.extensions.exception.stacktrace;
		}

		return err;
	}
});

module.exports = apolloServer;
