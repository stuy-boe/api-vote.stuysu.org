const router = require("express").Router();

router.get("/", async (req, res) => {
	res.json({
		success:true,
		payload: await req.election.getCandidates()
	});
});


module.exports = router;
