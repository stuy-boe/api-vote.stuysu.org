const router = require("express").Router();

router.get("/", (req, res) => {

	res.json({
		success: true,
		payload: {
			date: new Date().toISOString()
		}
	});

});
