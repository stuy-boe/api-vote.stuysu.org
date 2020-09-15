const { ApolloError } = require('apollo-server-express');
const mongoose = require('mongoose');
const Candidate = mongoose.model('Candidate');

module.exports = async (
	root,
	{ candidateId },
	{ jwt, autheticationRequired }
) => {
	autheticationRequired();

	const candidate = await Candidate.findById(candidateId);

	if (!candidate) {
		throw new ApolloError(
			"There's no candidate with that ID",
			'ID_NOT_FOUND'
		);
	}

	const isFollowing = candidate?.followers?.includes(
		follower => follower.userId === jwt.user.id
	);

	if (!isFollowing) {
		candidate.followers.push({
			userId: jwt.user.id
		});

		await candidate.save();
	}

	return true;
};
