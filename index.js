const db = require("./config/database");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require("path");
const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const morgan = require("morgan");

const expressSession = require("express-session");

const MySQLStore = require('express-mysql-session')(expressSession);
const sessionStore = new MySQLStore({
	clearExpired: true,
	checkExpirationInterval: 900000,
	expiration: Number(process.env.SESSION_MAX_AGE) || (15 * 86400 * 1000),
	createDatabaseTable: true,
}, db.pool);

const session = expressSession({
	secret: process.env.SESSION_SECRET ||"some_semi_permanent_not_so_secret_secret",
	name: "session",
	resave: true,
	saveUninitialized: true,
	store: sessionStore,
	cookie: {
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: Number(process.env.SESSION_MAX_AGE) || (15 * 86400 * 1000)
	}
});

app.use(session);

const app_port = process.env.PORT || 3001;

app.use(cookieParser("some_semi_permanent_secret"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.route("/").get((req,res) => {
	res.send("Hello World!")
});

app.use(express.static(path.join(__dirname, 'client/build')));

server.listen(app_port, () => {
	console.log('listening on *:' + app_port);
});
