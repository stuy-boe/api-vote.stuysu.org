const mongoose = require('mongoose');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

const sequelizeStore = new MongoStore({
	mongooseConnection: mongoose.connection
});
const cookieSecret = process.env.SESSION_SECRET || 'some_semi_permanent_secret';

const sessionOptions = {
	secret: cookieSecret,
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
	sessionOptions.cookie.secure = true;
	sessionOptions.cookie.sameSite = 'none';
}

const session = expressSession(sessionOptions);

module.exports = session;
