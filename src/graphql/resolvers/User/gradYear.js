module.exports = (user, args, { authenticationRequired }) => {
	authenticationRequired(['gradYear']);

	return user.gradYear;
};
