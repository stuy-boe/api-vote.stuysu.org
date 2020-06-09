const router = require('express').Router();
const RequestRefusalError = require('../../../../utils/RequestRefusalError');
const { adminPrivileges, elections } = require('./../../../../database');

// Only admins with the 'elections' privilege can access the following endpoints
router.use(async (req, res, next) => {
	const hasAdminPrivilege = await adminPrivileges.exists(
		req.session.email,
		'elections'
	);

	if (!hasAdminPrivilege) {
		throw new RequestRefusalError(
			"You don't have permission to use this endpoint.",
			'INSUFFICIENT_PERMISSIONS'
		);
	}

	next();
});

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

router.use('/pics', require('./pics'));
router.use('/create', require('./create'));
router.use('/:publicUrl', require('./selected'));

module.exports = router;
