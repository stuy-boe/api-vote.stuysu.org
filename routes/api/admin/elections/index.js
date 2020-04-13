const router = require('express').Router();

router.use('/pics', require('./pics'));

module.exports = router;
