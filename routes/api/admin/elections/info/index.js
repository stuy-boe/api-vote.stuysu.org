const router = require('express').Router({
	mergeParams: true
});
const {
	elections,
	allowedGrades,
	votes,
	sequelize,
	candidates
} = require('./../../../../../database');

router.use(async (req, res, next) => {
	let election = await elections.findOne({
		where: {
			publicUrl: req.params.publicUrl
		},
		subQuery: true,
		include: [
			{ model: candidates },
			{ model: allowedGrades },
			{ model: votes, attributes: [] }
		],
		attributes: [
			'name',
			[sequelize.fn('COUNT', sequelize.col('vote.userHash')), 'numVotes']
		]
	});

	if (election.id === null) {
		res.status(404).json({
			success: false,
			error: {
				code: 'NOT_FOUND',
				message: 'There is no election with that url'
			},
			payload: null
		});
	} else {
		req.election = election;

		next();
	}
});

router.get('/', (req, res) =>
	res.json({ success: true, payload: req.election })
);

module.exports = router;