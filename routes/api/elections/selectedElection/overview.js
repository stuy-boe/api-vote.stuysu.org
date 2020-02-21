const router = require("express").Router();

router.get("/", async (req, res) => {
	req.election.candidates = await req.election.getCandidates();
	res.json({success: true, payload: req.election});
});

module.exports = router;
