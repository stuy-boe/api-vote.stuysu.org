const router = require('express').Router();
const { adminPrivileges } = require('./../../database');

router.get('/', async (req, res) => {
	if (!req.session.signedIn) {
		return res.json({
			success: true,
			payload: {
				signedIn: false
			}
		});
	}

	const privileges = await adminPrivileges.list(req.session.email);
	const isAdmin = Boolean(privileges.length);
	// TODO UPDATE ADMIN AND CAMPAIGNING WITH REAL VALUES
	return res.json({
		success: true,
		payload: {
			signedIn: true,
			user: {
				email: req.session.email,
				name: req.session.name
			},
			admin: {
				status: isAdmin,
				privileges
			},
			campaignManager: {
				status: true,
				campaigns: ['1']
			},
			expires: req.session.cookie.expires.toISOString()
		}
	});
});

module.exports = router;
