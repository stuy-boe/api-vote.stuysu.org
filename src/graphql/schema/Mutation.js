const { gql } = require('apollo-server-express');

module.exports = gql`
	type Mutation {
		# Returns JSON Web Token
		login(idToken: String!): String
		logout: Boolean

		createUpdate(
			title: String!
			content: String!
			link: String
			pictures: [Upload!]
			candidateId: String!
		): Update

		voteRunoff(electionId: String!, choices: [String!]!): Vote

		follow(candidateId: String!): Boolean
		unfollow(candidateId: String!): Boolean
	}
`;
