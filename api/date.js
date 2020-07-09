const router = require('express').Router();

router.get('/', (req, res) => {
	res.set('Cache-Control', 'no-store');

	res.json({
		success: true,
		payload: {
			date: new Date().toISOString()
		}
	});
});

module.exports = router;
