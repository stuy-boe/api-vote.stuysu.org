const { gql } = require('apollo-server-express');

module.exports = gql`
	type Candidate {
		id: String
		name: String
		electionId: String
		election: Election
		url: String
		profilePic: CloudinaryPicture
		coverPic: CloudinaryPicture
		updates: [Update]

		active: Boolean
	}
`;
