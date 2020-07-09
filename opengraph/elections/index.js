const router = require('express').Router({ mergeParams: true });
const { elections } = require('../../database');
const urlJoin = require('url-join');

router.get('/', (req, res, next) => {
	req.og.title = 'Elections | Stuy BOE Voting Site';
	req.og.description =
		'View results of elections from the past as well as up to date information about current elections.';
	next();
});

router.get('/:publicUrl', require('./selected'));

module.exports = router;
