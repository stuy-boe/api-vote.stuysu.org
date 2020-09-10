const { gql } = require('apollo-server-express');
module.exports = gql`
	type RunoffVote {
		userHash: String
		choices: [Candidate]
		grade: Int
	}
`;
