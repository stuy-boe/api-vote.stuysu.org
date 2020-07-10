const router = require('express').Router({ mergeParams: true });
const { elections } = require('./../../../database');

router.use('/', async (req, res, next) => {
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
		req.og.title = 'Election Not Found | Stuy BOE Voting Site';
		req.og.description = 'There is no election at that url... yet!';
	}

	next();
});

router.use('/candidates', require('./candidates'));
router.use('/vote', require('./vote'));
router.use('/results', require('./results'));

module.exports = router;
