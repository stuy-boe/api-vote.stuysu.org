const router = require('express').Router();
const { adminPrivileges } = require('../../../../../database');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const folder = process.env.CLOUDINARY_FOLDER || '';
const electionPicsFolder = path.join(folder, 'electionPics');
const RefusalError = require('../../../../../utils/RefusalError');

router.get('/', async (req, res) => {
	if (!req.session.signedIn) {
		throw new RefusalError(
			'You need to be authenticated to use this endpoint.',
			'AUTH_REQUIRED'
		);
	}

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

	const response = await cloudinary.api.resources({
		type: 'upload',
		prefix: electionPicsFolder
	});

	const items = response.resources.map(i => i.public_id);

	res.json({
		success: true,
		payload: items
	});
});

module.exports = router;
