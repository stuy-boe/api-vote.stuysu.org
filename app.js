require('express-async-errors');
require('./models');
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const parsers = require('./middleware/parsers');
const proxyValidator = require('./middleware/proxyValidator');
const session = require('./middleware/session');
const sessionValidator = require('./middleware/sessionValidator');
const apolloServer = require('./graphql');

const compression = require('compression');
app.use(compression());

if (process.env.SERVE_FRONT_END === 'true') {
	// Check to see if the request is a static file before moving on
	app.use(
		express.static('./client/build', {
			index: false,
			lastModified: true,
			maxAge: '1m'
		})
	);
}

// In production it will only log when a 500 error occurs
app.use(logger);

// Body and Cookie parsers
app.use(parsers);

// vote.stuysu.org is served by cloudflare we have a custom proxy validator
app.set('trust proxy', proxyValidator);

// Express session & custom validator to check for decryption cookies
app.use(session);
app.use(sessionValidator);

apolloServer.applyMiddleware({ app, path: '/graphql', cors: false });

// Catch-all handler to serve the react index page
if (process.env.SERVE_FRONT_END === 'true') {
	const opengraph = require('./opengraph');
	app.use(opengraph);

	const nunjucks = require('nunjucks');

	nunjucks.configure('client/build', {
		autoescape: true,
		express: app
	});

	app.get('*', (req, res, next) => {
		res.set('Cache-Control', `public, max-age=${60 * 60 * 12}`);
		res.render('index.html', {
			og: req.og,
			date: new Date()
		});

		next();
	});

	const errorHandler = require('./middleware/frontendErrorHandler');
	app.use(errorHandler);
}

module.exports = app;
