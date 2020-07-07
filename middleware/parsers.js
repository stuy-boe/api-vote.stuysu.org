const router = require('express').Router();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.SESSION_SECRET || 'some_semi_permanent_secret';

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser(cookieSecret));

module.exports = router;
