module.exports = async (election, args, { jwt, getUser }) => {
	if (!jwt) {
		// There's no way to tell if the user has voted if they're not signed in
		return null;
	}

	const user = await getUser();

	return user.votedFor?.includes(election._id);
};
