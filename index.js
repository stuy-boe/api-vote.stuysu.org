const
	dotenv = require('dotenv');
	db = require("./config/database"),
	app_port = process.env.PORT || 3001,
	bodyParser = require("body-parser"),
	cookieParser = require('cookie-parser'),
	path = require("path"),
	express = require("express"),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	morgan = require("morgan"),
	expressSession = require("express-session"),
	SequelizeConnectSession = require('connect-session-sequelize')(expressSession.Store),
	sequelizeStore = new SequelizeConnectSession({db: db.sequelize}),
	session = expressSession({
		secret: process.env.SESSION_SECRET || "some_semi_permanent_not_so_secret_secret",
		name: "session",
		resave: true,
		saveUninitialized: false,
		store: sequelizeStore,
		cookie: {
			path: '/',
			httpOnly: true,
			secure: false,
			maxAge: Number(process.env.SESSION_MAX_AGE) || (15 * 86400 * 1000)
		},
		rolling: true
	});

dotenv.config();

sequelizeStore.sync();

app.use(session);

app.use(cookieParser("some_semi_permanent_secret"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan(
	process.env.MORGAN_FORMAT || "dev",
	{
		skip: (req, res) => { return res.statusCode < 400 /* Ignore successful requests */ }
	}));

const handleDefaultNavigation = (req, res) => {
	// TODO add in server side rendering
	res.sendFile(path.join(__dirname, 'client/build/index.html'));
};

// Catch the index page before it is handled statically
// Otherwise server side rendering doesn't happen
app.route("/").get(handleDefaultNavigation);

app.use(express.static(path.join(__dirname, 'client/build')));

// Fallback to react for non-static files
app.route("*").get(handleDefaultNavigation);

server.listen(app_port, () => {
	console.log('listening on *:' + app_port);
});
