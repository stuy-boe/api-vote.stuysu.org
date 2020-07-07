require('express-async-errors');
const express = require('express');
const app = express();

const compression = require('compression');
app.use(compression());

// This is up here at the top because we want our static files served ASAP
// This prevents requests for static files from passing through unnecessary middleware
// i.e. We don't need to validate the session if the user just wants /favicon.ico
if (process.env.SERVE_FRONT_END === 'true') {
	const opengraph = require('./opengraph');
	app.use(opengraph);

	const nunjucks = require('nunjucks');

	nunjucks.configure('client/build', {
		autoescape: true,
		express: app
	});

	// Adding this to the res object for less repititon
	app.use((req, res, next) => {
		res.serveReact = () => {
			res.render('index.html', {
				og: req.og,
				date: new Date()
			});
		};

		next();
	});

	// Catch the index before it's served statically so that we can render open graph props
	app.get('/', (req, res) => res.serveReact());
	app.get('/index.html', (req, res) => res.serveReact());

	// Check to see if the request is a static file before moving on
	app.use(express.static('./client/build'));
}

// In production it will only log when a 500 error occurs
const logger = require('./middleware/logger');
app.use(logger);

// Body and Cookie parsers
const parsers = require('./middleware/parsers');
app.use(parsers);

// vote.stuysu.org is served by cloudflare we have a custom proxy validator
const proxyValidator = require('./middleware/proxyValidator');
app.set('trust proxy', proxyValidator);

// Express session & custom validator to check for decryption cookies
const session = require('./middleware/session');
const sessionValidator = require('./middleware/sessionValidator');

app.use(session);
app.use(sessionValidator);

// API Routes
app.use('/api', require('./api'));

// Catch-all handler in case none of the routes worked
if (process.env.SERVE_FRONT_END === 'true') {
	app.get('*', (req, res) =>
		res.render('index.html', {
			og: req.og,
			date: new Date()
		})
	);
}

module.exports = app;
