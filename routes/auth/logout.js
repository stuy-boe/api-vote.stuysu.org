const router = require("express").Router();

router.get("/", (req, res) => {
	req.session.destroy();
	res.json({success: true});
});

module.exports = router;
