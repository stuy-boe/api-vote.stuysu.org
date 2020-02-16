const router = require("express").Router();

router.get("/", (req, res) => {
	if( ! req.session.signedIn )
		return res.json({signedIn: false});

	// TODO UPDATE ADMIN AND CAMPAIGNING WITH REAL VALUES
	return res.json({
		signedIn: true,
		user: {
			email: req.session.email,
			name: req.session.name
		},
		admin: {
			is_admin: true,
			admin_privileges: "*"
		},
		campaign: {
			is_manager: true,
			manager_for: ["1"]
		}
	});
});

module.exports = router;
