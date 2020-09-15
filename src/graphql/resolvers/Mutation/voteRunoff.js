const { ApolloError, ForbiddenError } = require('apollo-server-express');
const calcGrade = require('../../../utils/calcGrade');

const mongoose = require('mongoose');
const Election = mongoose.model('Election');
const Candidate = mongoose.model('Candidate');

module.exports = async (
	root,
	{ electionId, choices },
	{ authenticationRequired, getUser }
) => {
	authenticationRequired();

	const election = await Election.findOne({ _id: electionId })
		.select('+runoffVotes')
		.exec();

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

	const existingVote = await user?.votedFor?.includes(election._id);

	if (existingVote) {
		throw new ApolloError(
			'You have already voted for this election',
			'ALREADY_VOTED'
		);
	}

	const candidates = await Candidate.find({ electionId });

	// Get rid of candidates that don't exist
	const cleanChoices = choices.filter(choice =>
		candidates.some(candidate => candidate._id === choice)
	);

	if (!cleanChoices.length) {
		throw new ForbiddenError(
			'You must select at least one candidate to vote for'
		);
	}

	if (!election.runoffVotes) {
		election.runoffVotes = [];
	}

	const vote = {
		grade: calcGrade(user.gradYear),
		choices: cleanChoices
	};

	election.runoffVotes.push(vote);

	await election.save();

	return vote;
};
