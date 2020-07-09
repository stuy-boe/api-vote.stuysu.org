const router = require('express').Router();

router.get('/', (req, res, next) => {
	if (req.election) {
		req.og.title = `Results: ${req.election.name} | Stuy BOE Voting Site`;
		req.og.description = `View the results for ${req.election.name}.`;
	}

	next();
});

module.exports = router;
