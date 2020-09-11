const { gql } = require('apollo-server-express');
module.exports = gql`
	type RunoffVote {
		id: String
		choices: [Candidate]
		grade: Int
	}
`;
