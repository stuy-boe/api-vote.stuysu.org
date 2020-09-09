const router = require('express').Router();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { COOKIE_SECRET } = require('../constants');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser(COOKIE_SECRET));

module.exports = router;
