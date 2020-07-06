require('express-async-errors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieSecret = process.env.SESSION_SECRET || 'some_semi_permanent_secret';
const session = require('./middleware/session');
const sessionValidator = require('./middleware/sessionValidator');

const proxyValidator = require('./middleware/proxyValidator');

app.set('trust proxy', proxyValidator);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cookieSecret));
app.use(session);
app.use(sessionValidator);

const loggerFormat = process.env.MORGAN_FORMAT || 'dev';
const logger = morgan(loggerFormat, {
	skip: (req, res) => res.statusCode < 400
});

app.use(logger);

// ROUTES
app.use('/', require('./routes'));

module.exports = app;
