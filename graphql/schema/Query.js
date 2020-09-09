const { gql } = require('apollo-server-express');

module.exports = gql`
	type Query {
		user(id: String, email: String): User

		elections: [Election]
		election(id: String, url: String): Election

		candidates(electionId: String!): [Candidate]
		candidate(id: String, url: String): Candidate

		authenticatedUser: User

		date: DateTime
	}
`;
