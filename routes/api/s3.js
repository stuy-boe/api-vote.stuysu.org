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

	const crop = req.query.crop;

	const gravity = req.query.gravity;
	const radius = req.query.radius;
	const flags = req.query.flags;
	const quality = req.query.quality;
	const background = req.query.background;

	const cloudinaryUrl = cloudinary.url(adjustedPath, {
		height,
		width,
		crop,
		gravity,
		radius,
		flags,
		background,
		quality,
		secure: true
	});

	// Redirect the user to the appropriate object on our s3 service
	res.status(301).redirect(cloudinaryUrl);
});

module.exports = router;
