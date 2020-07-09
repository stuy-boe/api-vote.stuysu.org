const router = require('express').Router();

router.get('/', (req, res, next) => {
	if (req.election) {
		req.og.title = `Candidates: ${req.election.name} | Stuy BOE Voting Site`;
		req.og.description = `Meet the candidates for ${req.election.name}.`;
	}

	next();
});

module.exports = router;
