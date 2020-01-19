const url = require("url");
const router = require("express").Router();

router.get("*", (req, res) => {
	res.status(301).redirect(url.resolve((process.env.S3_URI || "/storage"),  req.path));
});

module.exports = router;
