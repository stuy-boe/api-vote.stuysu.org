require('express-async-errors');
require('./models');

const { COOKIE_SECRET } = require('./constants');
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const proxyValidator = require('./middleware/proxyValidator');
const cors = require('./middleware/cors');
const apolloServer = require('./graphql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwtValidator = require('./middleware/jwtValidator');

// In production it will only log when a 500 error occurs
app.use(logger);

// Body and Cookie parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));

app.use(cors);
// vote.stuysu.org is served by cloudflare we have a custom proxy validator
app.set('trust proxy', proxyValidator);

app.use(jwtValidator);

apolloServer.applyMiddleware({ app, path: '/graphql', cors: false });

module.exports = app;
