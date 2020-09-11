const { gql } = require('apollo-server-express');
module.exports = gql`
	type PluralityVote {
		id: String
		choices: [Candidate]
		grade: Int
	}
`;
