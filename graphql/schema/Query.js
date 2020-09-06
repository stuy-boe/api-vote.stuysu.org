const { gql } = require('apollo-server-express');

module.exports = gql`
	type Query {
		user(id: String, email: String): User
		election(id: String, url: String): Election
		candidate(id: String): Candidate

		authenticatedUser: User
	}
`;
