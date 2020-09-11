const { gql } = require('apollo-server-express');

module.exports = gql`
	type RunoffCandidateRoundResult {
		candidate: Candidate
		numVotes: Int
		percentage: Float
		eliminated: Boolean
	}

	type RunoffRound {
		number: Int
		numVotes: Int
		results: [RunoffCandidateRoundResult]
		eliminatedCandidates: [Candidate]
	}

	type RunoffResult {
		rounds: [RunoffRound]
		winner: Candidate
		numPeopleVoted: Int
		isTie: Boolean
		numEligibleVoters: Int
	}
`;
