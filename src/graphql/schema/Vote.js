const { gql } = require('apollo-server-express');
module.exports = gql`
	type Vote {
		id: String
		choices: [Candidate]
		grade: Int
	}
`;
