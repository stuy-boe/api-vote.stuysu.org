const { gql } = require('apollo-server-express');

module.exports = gql`
	type Mutation {
		login(idToken: String!): User
	}
`;
