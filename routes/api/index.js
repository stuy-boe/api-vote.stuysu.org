const router = require('express').Router({
	mergeParams: true
});

router.use('/auth', require('./auth'));
router.use('/talos', require('./talos'));
router.use('/elections', require('./elections'));
router.use('/state', require('./state'));
router.use('/s3', require('./s3'));
router.use('/date', require('./date'));

module.exports = router;
