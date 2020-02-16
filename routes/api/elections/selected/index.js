const router = require("express").Router({mergeParams: true});
const {Elections} = require("./../../../../database");

router.use(async (req, res, next) => {
	let election = await Elections.findOne({where: {public_url: req.params.public_url}});

	if(! election){
		res.json({
			success: false,
			error: "There is no election with that url id"
		});
	} else {
		req.election = election;
		next();
	}
});

router.get("/", (req, res) => res.json(req.election));
router.use("/overview", require("./overview"));
router.use("/candidates", require("./candidates"));


module.exports = router;
