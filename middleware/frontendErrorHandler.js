const frontendErrorHandler = function (err, req, res, next) {
	console.error(err.stack);

	req.og.title = 'Error 500 | StuyBOE Voting Site';
	req.og.description =
		'There was an issue on the server. Please email us if you see this again.';

	res.render('index.html', {
		og: req.og,
		date: new Date(),
		error: {
			code: 'SERVER_ERROR',
			message:
				'There was an unexpected on the server loading this page. Let us know if this happens again.'
		}
	});
};

module.exports = frontendErrorHandler;
