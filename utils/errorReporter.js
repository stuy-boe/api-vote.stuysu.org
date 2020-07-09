let errorReporter;
if (process.env.HONEYBADGER_KEY) {
	errorReporter = require('honeybadger').configure({
		apiKey: process.env.HONEYBADGER_KEY,
		logger: console
	});
} else {
	errorReporter = {
		notify: console.error
	};
}

module.exports = errorReporter;
