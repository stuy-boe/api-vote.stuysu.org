const router = require("express").Router();

router.get("/", (req, res) => {
	if( ! req.session.signedIn )
		return res.json({
			success: true,
			payload: {
				signedIn: false,
				date: new Date()
			}
		});

	// TODO UPDATE ADMIN AND CAMPAIGNING WITH REAL VALUES
	return res.json({
		success: true,
		payload: {
			signedIn: true,
			date: new Date(),
			user: {
				email: req.session.email,
				name: req.session.name
			},
			admin: {
				status: true,
				privileges: "*"
			},
			campaignManager: {
				status: true,
				campaigns: ["1"]
			}
		}
	});

});

module.exports = router;
