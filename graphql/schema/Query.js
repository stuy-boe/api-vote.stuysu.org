const { gql } = require('apollo-server-express');

module.exports = gql`
	type Query {
		user(id: String, email: String): User
	}
`;
