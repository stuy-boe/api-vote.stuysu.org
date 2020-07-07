const router = require('express').Router({ mergeParams: true });
const { elections } = require('../../database');
const urlJoin = require('url-join');

router.get('/', (req, res, next) => {
	req.og.title = 'All Elections | Stuy BOE Voting Site';
	req.og.description =
		'View results of elections from the past as well as up to date information about current elections.';
	next();
});

router.use('/:publicUrl', async (req, res, next) => {
	req.election = await elections.findOne({
		where: { publicUrl: req.params.publicUrl }
	});

	if (req.election) {
		req.og.title = `${req.election.name} | Stuy BOE Voting Site`;
		req.og.description = `Overview of ${req.election.name}. Vote, view updates, learn about candidates and more.`;
		req.og.image = urlJoin(
			process.env.REACT_APP_API_URL || process.env.PUBLIC_URL || '',
			`/api/s3`,
			req.election.picture,
			`?flags=lossy`,
			`?quality=auto`
		);
	} else {
		req.og.title = 'Election not found';
		req.og.description = 'There is no election at that url... yet!';
	}

	next();
});

module.exports = router;
