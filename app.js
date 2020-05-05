require('express-async-errors');

const db = require('./database');
const sessionValidator = require('./utils/sessionValidator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const morgan = require('morgan');
const expressSession = require('express-session');
const SequelizeConnectSession = require('connect-session-sequelize')(
	expressSession.Store
);
const sequelizeStore = new SequelizeConnectSession({
	db: db.sequelize
});

const sessionOptions = {
	secret: process.env.SESSION_SECRET || 'some_semi_permanent_secret',
	name: 'session',
	resave: true,
	saveUninitialized: false,
	store: sequelizeStore,
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: Number(process.env.SESSION_MAX_AGE) || 15 * 86400 * 1000
	},
	rolling: true
};

if (process.env.NODE_ENV === 'production') {
	app.set('trust proxy', 1);
	sessionOptions.cookie.secure = true;
	sessionOptions.cookie.sameSite = 'none';
}

const session = expressSession(sessionOptions);

sequelizeStore.sync();

app.use(session);

app.use(
	cookieParser(process.env.SESSION_SECRET || 'some_semi_permanent_secret')
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const logger = morgan(process.env.MORGAN_FORMAT || 'dev', {
	skip: (req, res) => res.statusCode < 400
});

app.use(logger);

app.use(sessionValidator);

// ROUTES
app.use('/', require('./routes'));

module.exports = app;
