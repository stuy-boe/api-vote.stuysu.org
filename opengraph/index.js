const router = require('express').Router();
const urlJoin = require('url-join');

const publicUrl = process.env.PUBLIC_URL || '';

router.get('*', (req, res, next) => {
	req.og = {};
	req.og.siteName = 'Stuyvesant Board of Elections Voting Site';
	req.og.title = 'Error 404 - Page Not Found | Stuy BOE Voting Site';
	req.og.type = 'website';
	req.og.image = urlJoin(publicUrl, '/img', '/logo512.png');
	req.og.description = 'This page does not exist or has been moved';
	req.og.url = urlJoin(publicUrl, req.path);

	next();
});

router.get('/', (req, res, next) => {
	req.og.title = 'Home | Stuy BOE Voting Site';
	req.og.description =
		'This is where voting as well as campaigning for Student Union elections takes place.';
	next();
});

router.use('/elections', require('./elections'));

module.exports = router;
