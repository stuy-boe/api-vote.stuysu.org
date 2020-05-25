const db = require('./../database');

const expressSession = require('express-session');
const SequelizeConnectSession = require('connect-session-sequelize')(
	expressSession.Store
);
const sequelizeStore = new SequelizeConnectSession({
	db: db.sequelize
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
	app.set('trust proxy', 1);
	sessionOptions.cookie.secure = true;
	sessionOptions.cookie.sameSite = 'none';
}

const session = expressSession(sessionOptions);

sequelizeStore.sync();

module.exports = session;
