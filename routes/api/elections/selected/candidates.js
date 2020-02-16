const router = require("express").Router();

router.get("/", async (req, res) => {
	res.json(await req.election.getCandidates());
});


module.exports = router;
