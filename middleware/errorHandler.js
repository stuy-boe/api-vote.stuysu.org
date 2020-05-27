const RequestRefusalError = require('../utils/RequestRefusalError');

const errorHandler = (err, req, res, next) => {
	if (err instanceof RequestRefusalError) {
		res.status(403).json({
			success: false,
			error: { code: err.code, message: err.message }
		});
	} else {
		console.error(err);

		res.status(500).json({
			success: false,
			error: {
				code: 'SERVER_ERROR',
				message:
					'There was an unexpected server error. We will review this shortly.'
			}
		});
	}
};

module.exports = errorHandler;
