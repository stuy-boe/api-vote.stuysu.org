const { gql } = require('apollo-server-express');

module.exports = gql`
	type User {
		id: String!
		firstName: String
		lastName: String
		gradYear: Int
		grade: Int
		email: String
	}
`;
