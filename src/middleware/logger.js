const morgan = require('morgan');
const loggerFormat = process.env.MORGAN_FORMAT || 'dev';
const logger = morgan(loggerFormat, {
	skip: (req, res) =>
		res.statusCode < 500 && process.env.NODE_ENV === 'production'
});

module.exports = logger;
