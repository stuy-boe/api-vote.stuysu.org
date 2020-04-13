const router = require('express').Router();

router.use('/elections', require('./elections'));

module.exports = router;
