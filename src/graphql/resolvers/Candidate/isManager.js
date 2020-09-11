module.exports = async (candidate, args, { getUser, jwt }) => {
	if (!jwt) {
		return null;
	}

	const user = await getUser();

	return user.candidatesManaged.includes(candidate._id);
};
