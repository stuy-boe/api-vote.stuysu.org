const { gql } = require('apollo-server-express');

module.exports = gql`
	type PluralityCandidateResult {
		candidate: Candidate
		numVotes: Int
		percentage: Float
	}

	type PluralityResult {
		results: [PluralityCandidateResult]
		winner: Candidate
		numVotes: Int
		numEligibleVoters: Int
	}
`;
