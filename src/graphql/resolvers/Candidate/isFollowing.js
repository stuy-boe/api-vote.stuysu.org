module.exports = (candidate, args, { jwt }) => {
	if (!jwt) {
		return null;
	}

	return candidate.followers?.some(
		follower => follower.userId === jwt.user.id
	);
};
