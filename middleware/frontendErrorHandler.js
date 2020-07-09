const errorReporter = require('../utils/errorReporter');
const frontendErrorHandler = function (err, req, res, next) {
	const {
		originalUrl,
		path,
		params,
		query,
		hostname,
		body,
		baseUrl,
		protocol,
		session
	} = req;

	errorReporter.notify(err, {
		context: {
			path,
			query,
			hostname,
			body,
			baseUrl,
			protocol
		},
		url: originalUrl,
		session,
		params
	});

	req.og.title = 'Error 500 | StuyBOE Voting Site';
	req.og.description =
		'There was an issue on the server. Please email us if you see this again.';

	res.render('index.html', { og: req.og });
};

module.exports = frontendErrorHandler;
