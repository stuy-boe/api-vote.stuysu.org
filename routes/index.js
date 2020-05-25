const router = require('express').Router({
	mergeParams: true
});

// Cross-Origin rules apply to all requests
router.use('*', require('../middleware/cors'));

router.use('/api', require('./api'));

router.use(require('../middleware/errorHandler'));

module.exports = router;
