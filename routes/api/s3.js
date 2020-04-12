const url = require('url');
const path = require('path');
const router = require('express').Router();

router.get('*', (req, res) => {
	// Redirect the user to the appropriate object on our s3 service
	let s3Url = url.parse(process.env.S3_URL || '/storage');
	s3Url.pathname = path.join(s3Url.pathname, req.path);

	res.status(301).redirect(url.format(s3Url));
});

module.exports = router;
