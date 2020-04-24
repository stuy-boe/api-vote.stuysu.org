const router = require('express').Router();
const { adminPrivileges } = require('../../../../../database');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const folder = process.env.CLOUDINARY_FOLDER || '';
const electionPicsFolder = path.join(folder, 'electionPics');

router.get('/', async (req, res) => {
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
