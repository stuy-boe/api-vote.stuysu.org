const router = require('express').Router({
	mergeParams: true
});

// Cross-Origin rules apply to all requests
router.use('*', require('../middleware/cors'));

router.use((req, res, next) => {
	res.set('Cache-Control', 'no-store');
	next();
});

router.use('/admin', require('./admin'));
router.use('/auth', require('./auth'));
router.use('/talos', require('./talos'));
router.use('/elections', require('./elections'));
router.use('/state', require('./state'));
router.use('/s3', require('./s3'));

// The date api is included in the app.js file
// because we don't want it to unnecessarily pass through session middleware

// Catches rejections and 500 errors
const errorHandler = require('./errorHandler');
router.use(errorHandler);

module.exports = router;
