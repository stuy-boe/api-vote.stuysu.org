const router = require('express').Router({
	mergeParams: true
});

// Cross-Origin rules apply to all requests
router.use('*', require('../middleware/cors'));

router.use('/admin', require('./admin'));
router.use('/auth', require('./auth'));
router.use('/talos', require('./talos'));
router.use('/elections', require('./elections'));
router.use('/state', require('./state'));
router.use('/s3', require('./s3'));
router.use('/date', require('./date'));

// Catches rejections and 500 errors
const errorHandler = require('../middleware/errorHandler');
router.use(errorHandler);

module.exports = router;
