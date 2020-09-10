require('dotenv').config();

const { randomBytes } = require('crypto');

exports.COOKIE_SECRET =
	process.env.COOKIE_SECRET || randomBytes(32).toString('hex');

exports.NODE_ENV = process.env.NODE_ENV || 'development';
