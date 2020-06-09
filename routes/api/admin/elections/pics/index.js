const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const path = require('path');
const folder = process.env.CLOUDINARY_FOLDER || '';
const electionPicsFolder = path.join(folder, 'electionPics');

router.get('/', async (req, res) => {
	const response = await cloudinary.api.resources({
		type: 'upload',
		prefix: electionPicsFolder,
		max_results: 999
	});

	const items = response.resources
		.sort((item1, item2) => {
			const item1Created = new Date(item1.created_at);
			const item2Created = new Date(item2.created_at);
			return item1.created_at > item2.created_at ? -1 : 1;
		})
		.map(i => i.public_id);

	res.json({
		success: true,
		payload: items
	});
});

router.use('/upload', require('./upload'));

module.exports = router;
