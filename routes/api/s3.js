const router = require('express').Router();
const cloudinary = require('cloudinary').v2;

router.get('*', (req, res) => {
	// replace will only replace the first instance
	const adjustedPath = req.path.replace('/', '');

	let width = Number(req.query.width) || undefined;

	if (width && width > 1000) {
		width = 1000;
	}

	let height = Number(req.query.height) || undefined;

	if (height && height > 1000) {
		height = 1000;
	}

	let crop = req.query.crop;

	let gravity = req.query.gravity;
	let radius = req.query.radius;

	const cloudinaryUrl = cloudinary.url(adjustedPath, {
		height,
		width,
		crop,
		gravity,
		radius,
		secure: true
	});

	// Redirect the user to the appropriate object on our s3 service
	res.status(301).redirect(cloudinaryUrl);
});

module.exports = router;
