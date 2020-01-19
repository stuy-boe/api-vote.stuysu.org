const url = require("url");
const path = require("path");
const router = require("express").Router();

router.get("*", (req, res) => {

	// Redirect the user to the appropriate object on our s3 service
	let s3_url = url.parse(process.env.S3_URL || "/storage");
	s3_url.pathname = path.join(s3_url.pathname, req.path);

	res.status(301).redirect(url.format(s3_url));
});

module.exports = router;
