const { elections } = require('./../../../../database');
const router = require('express').Router();

router.get('/', async (req, res) => {
	const allElections = await elections.findAll({
		order: [
			['startTime', 'DESC'],
			['endTime', 'DESC'],
			['completed', 'ASC']
		]
	});

	res.json({
		success: true,
		payload: allElections
	});
});

module.exports = router;
