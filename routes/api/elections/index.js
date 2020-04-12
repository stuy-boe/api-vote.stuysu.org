const router = require('express').Router({
	mergeParams: true
});

router.use('/', require('./all'));
router.use('/:publicUrl', require('./selectedElection'));
module.exports = router;
