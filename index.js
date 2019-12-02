const
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
	sequelizeStore = new (require('connect-session-sequelize')(expressSession.Store))({db: db.sequelize}),
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

sequelizeStore.sync();

app.use(session);

app.use(cookieParser("some_semi_permanent_secret"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.route("/").get((req,res) => {
	res.send("Hello World!");
});

app.use(express.static(path.join(__dirname, 'client/build')));

server.listen(app_port, () => {
	console.log('listening on *:' + app_port);
});
