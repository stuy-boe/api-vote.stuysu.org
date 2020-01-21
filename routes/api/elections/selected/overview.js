const router = require("express").Router();

router.get("/", async (req, res) => {
	res.send(await req.election.getCandidates());
});

module.exports = router;
