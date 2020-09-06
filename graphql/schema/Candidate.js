const { gql } = require('apollo-server-express');

module.exports = gql`
	type Candidate {
		id: String
		name: String
		url: String
		picture: CloudinaryPicture
		active: Boolean
	}
`;
