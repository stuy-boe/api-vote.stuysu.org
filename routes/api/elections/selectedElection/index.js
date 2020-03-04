const router = require("express").Router({mergeParams: true});
const Elections = require("../../../../old_database/models/Elections");

router.use(async (req, res, next) => {
	let election = await Elections.findOne({where: {publicUrl: req.params.publicUrl}});

	if(! election){
		res.json({
			success: false,
			error: "There is no election with that url id",
			payload: null
		});
	} else {
		req.election = election;
		next();
	}
});

router.get("/", (req, res) => res.json({success: true, payload: req.election}));
router.use("/overview", require("./overview"));
router.use("/candidates", require("./candidates"));
router.use("/vote", require("./vote"));


module.exports = router;
