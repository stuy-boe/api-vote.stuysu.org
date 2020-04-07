const {elections} = require("../../../database");
const router = require("express").Router();

router.get("/",  async (req, res) => {

	// Cache the response for 3 min
	res.set(`Cache-Control', 'public, max-age=${60 * 3}`);

	let elections = await elections.findAll({
		where: {visible: true},
		attributes: ["publicUrl", "name", "picture", "completed", "startTime", "endTime", "publicResults"]
	});

	let sorted = {
		active: [],
		completed: []
	};

	for(let x = 0; x < elections.length; x++){
		if(elections[x].completed)
			sorted.completed.push(elections[x]);
		else
			sorted.active.push(elections[x]);
	}

	res.json({success: true, payload: sorted});
});

module.exports = router;
