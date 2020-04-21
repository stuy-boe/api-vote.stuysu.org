const router = require('express').Router();
const RefusalError = require('./../../../../utils/RefusalError');
const { adminPrivileges } = require('./../../../../database');

// Only admins with the 'elections' privilege can access the following endpoints
router.use(async (req, res, next) => {
	const hasAdminPrivilege = await adminPrivileges.exists(
		req.session.email,
		'elections'
	);

	if (!hasAdminPrivilege) {
		throw new RefusalError(
			"You don't have permission to use this endpoint.",
			'INSUFFICIENT_PERMISSIONS'
		);
	}

	next();
});

router.use('/pics', require('./pics'));
router.use('/list', require('./list'));
router.use('/create', require('./create'));

module.exports = router;
