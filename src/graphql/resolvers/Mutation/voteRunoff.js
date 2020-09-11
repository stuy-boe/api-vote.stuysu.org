const { ApolloError, ForbiddenError } = require('apollo-server-express');
const crypto = require('crypto');
const calcGrade = require('../../../utils/calcGrade');

const mongoose = require('mongoose');
const Election = mongoose.model('Election');
const Vote = mongoose.model('Vote');
const User = mongoose.model('User');

module.exports = async (
	root,
	{ electionId, choices },
	{ authenticationRequired, getUser, jwt }
) => {
	authenticationRequired();

	const election = await Election.findById(electionId);

	if (!election) {
		throw new ApolloError(
			'There is no election with that id.',
			'ID_NOT_FOUND'
		);
	}

	const now = new Date();

	if (election.start > now || election.end < now) {
		throw new ForbiddenError(
			'It is not the voting period for this election.'
		);
	}

	const user = await getUser();

	if (
		!election.allowedGradYears ||
		!election.allowedGradYears.includes(user.gradYear)
	) {
		throw new ForbiddenError(
			'Your grade is not allowed to vote for this election.'
		);
	}

	// The 'r-' prefix identifies a runoff vote
	const voteId =
		'r-' +
		crypto
			.createHash('sha256')
			.update(election.id + jwt.user.sub)
			.digest('hex');

	const existingVote = await Vote.findById(voteId);

	if (existingVote) {
		throw new ApolloError(
			'You have already voted for this election',
			'ALREADY_VOTED'
		);
	}

	return Vote.create({
		_id: voteId,
		choices,
		electionId: election.id,
		grade: calcGrade(user.gradYear)
	});
};
