const { ApolloError, ForbiddenError } = require('apollo-server-express');
const calcGrade = require('../../../utils/calcGrade');

const mongoose = require('mongoose');
const Election = mongoose.model('Election');

module.exports = async (
	root,
	{ electionId, choices },
	{ authenticationRequired, getUser }
) => {
	authenticationRequired();

	const election = await Election.findOne({ _id: electionId })
		.select('+pluralityVotes')
		.exec();

	if (!election) {
		throw new ApolloError(
			'There is no election with that id.',
			'ID_NOT_FOUND'
		);
	}

	if (election.type !== 'plurality') {
		throw new ForbiddenError(
			'This is not a plurality election and you cannot submit a plurality vote for it.'
		);
	}

	if (!election.isVotingPeriod()) {
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

	const candidates = await election.getCandidates();

	let cleanChoices;

	if (!election.countDuplicates) {
		cleanChoices = Array.from(new Set(choices));
	}

	cleanChoices = cleanChoices.filter(choice =>
		candidates.some(candidate => candidate._id === choice)
	);

	if (cleanChoices.length > election.numChoices) {
		throw new ForbiddenError(
			`You are only allowed to vote for at most ${election.numChoices} candidates in this election.`
		);
	}

	if (!election.pluralityVotes) {
		election.pluralityVotes = [];
	}

	election.pluralityVotes.push({
		grade: calcGrade(user.gradYear),
		choices: cleanChoices
	});

	await election.save();

	await user.saveHasVoted(election._id);

	return true;
};
