const router = require('express').Router();
const urlJoin = require('url-join');

router.get('*', (req, res, next) => {
	req.og = {};
	req.og.siteName = 'Stuy Board of Elections Voting Site';
	req.og.title = 'Error 404 - Page Not Found | Stuy BOE Voting Site';
	req.og.type = 'website';
	req.og.image = urlJoin(process.env.PUBLIC_URL || '/img', '/logo512.png');
	req.og.description = 'This page does not exist or has been moved';
	req.og.url = url.resolve(process.env.PUBLIC_URL || '', req.path);

	next();
});

router.get('/', (req, res, next) => {
	req.og.title = 'Home | Stuy BOE Voting Site';
	req.og.description =
		'This is where voting as well as campaigning for Student Union Elections takes place';
	next();
});

router.use('/elections', require('./elections'));

module.exports = router;
