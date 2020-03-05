const
	dotenv = require('dotenv'),
	cors = require("cors"),
	db = require("./database"),
	sessionValidator = require("./tools/sessionValidator"),
	app_port = process.env.PORT || 3001,
	bodyParser = require("body-parser"),
	cookieParser = require('cookie-parser'),
	express = require("express"),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	morgan = require("morgan"),
	expressSession = require("express-session"),
	SequelizeConnectSession = require('connect-session-sequelize')(expressSession.Store),
	sequelizeStore = new SequelizeConnectSession({db: db.sequelize});

const sessionOptions = {
	secret: process.env.SESSION_SECRET || "some_semi_permanent_secret",
	name: "session",
	resave: true,
	saveUninitialized: false,
	store: sequelizeStore,
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: Number(process.env.SESSION_MAX_AGE) || (15 * 86400 * 1000),
	},
	rolling: true
};

if(process.env.NODE_ENV === "production"){
	app.set('trust proxy', 1);
	sessionOptions.cookie.secure = true;
	sessionOptions.cookie.sameSite = "none";
}

const session = expressSession(sessionOptions);

dotenv.config();


const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3001").split(" ");
const corsOptions = {
	origin: (origin, callback) => {

		if (! origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === "development")
			callback(null, true);

		else
			callback(new Error('Not allowed by CORS'));

	},
	credentials: true
};

app.use("/", cors(corsOptions));

sequelizeStore.sync();

app.use(session);

app.use(cookieParser(process.env.SESSION_SECRET || "some_semi_permanent_secret"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const logger = 	morgan(
	process.env.MORGAN_FORMAT || "dev",
	{skip: (req, res) =>  res.statusCode < 400}
	);

app.use(logger);

app.use(sessionValidator);

// ROUTES
app.use("/", require("./routes"));

server.listen(app_port, () => {
	console.log('listening on *:' + app_port);
});
