const router = require('express').Router();

router.use('/list', require('./list'));
router.use('/upload', require('./upload'));

module.exports = router;
