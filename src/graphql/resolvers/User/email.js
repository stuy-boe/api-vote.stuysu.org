module.exports = (user, args, { authenticationRequired }) => {
	authenticationRequired(['email']);

	return user?.email;
};
