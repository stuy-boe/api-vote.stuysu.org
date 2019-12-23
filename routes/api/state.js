module.exports = (req, res) => {
	if( ! req.session.signed_in )
		return res.json({signed_in: false});

	// TODO UPDATE ADMIN AND CAMPAIGNING WITH REAL VALUES
	return res.json({
		signed_in: true,
		user: {
			email: req.session.user.email,
			name: req.session.user.name
		},
		admin: {
			is_admin: false,
			admin_privileges: []
		},
		campaign: {
			is_manager: false,
			manager_for: []
		}
	});
};
