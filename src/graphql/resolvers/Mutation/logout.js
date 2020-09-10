module.exports = (root, args, { res }) => {
	res.cookie('auth-jwt', '', {
		maxAge: 0,
		overwrite: true
	});

	return true;
};
