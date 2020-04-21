const router = require('express').Router();

router.use('/pics', require('./pics'));
router.use('/create', require('./create'));

module.exports = router;
