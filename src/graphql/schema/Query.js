const { gql } = require('apollo-server-express');

module.exports = gql`
	type Query {
		user(id: String, email: String): User

		elections: [Election]
		election(id: String, url: String): Election

		candidates(electionId: String!): [Candidate]
		candidate(id: String!): Candidate

		authenticatedUser: User

		updates(electionId: String, candidateId: String): [Update]

		date: DateTime

		linkPreview(url: String!): LinkPreview
	}
`;
