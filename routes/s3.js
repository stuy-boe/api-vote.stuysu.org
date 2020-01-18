const path = require("path");
const router = require("express").Router();

router.get("*", (req, res) => {
	res.status(301).redirect(path.join((process.env.S3_URI || "/storage"),  req.path));
});

module.exports = router;
