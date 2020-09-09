const { gql } = require('apollo-server-express');

module.exports = gql`
	type Mutation {
		# Returns JSON Web Token
		login(idToken: String!): String
		logout: Boolean

		voteRunoff(electionId: String!, choices: [String!]!): RunoffVote
	}
`;
