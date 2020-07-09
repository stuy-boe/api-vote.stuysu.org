const router = require('express').Router();
const moment = require('moment-timezone');

router.get('/', (req, res, next) => {
	const startTimestring = moment(req.election.startTime)
		.tz('America/New_York')
		.format('LLLL z');

	if (req.election) {
		req.og.title = `Vote: ${req.election.name} | Stuy BOE Voting Site`;
		req.og.description = `Vote for ${req.election.name}. Starts ${startTimestring}.`;
	}

	next();
});

module.exports = router;
