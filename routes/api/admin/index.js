const router = require('express').Router();
const RefusalError = require('./../../../utils/RefusalError');

// Only authenticated users can use the /admin endpoint
router.use((req, res, next) => {
	if (!req.session.signedIn) {
		throw new RefusalError(
			'You need to be authenticated to use this endpoint.',
			'AUTH_REQUIRED'
		);
	}
	next();
});

router.use('/elections', require('./elections'));

module.exports = router;
