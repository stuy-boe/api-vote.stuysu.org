const router = require("express").Router({mergeParams: true});
const {elections} = require("./../../../../database");

router.use(async (req, res, next) => {
	let election = await elections.findOne({where: {publicUrl: req.params.publicUrl}});

	if(! election){

		res.status(404).json({
			success: false,
			error: {
				code: "NOT_FOUND",
				message: "There is no election with that url"
			},
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
