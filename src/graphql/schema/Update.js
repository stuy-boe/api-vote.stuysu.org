const { gql } = require('apollo-server-express');

module.exports = gql`
	type UpdateLink {
		title: String
		description: String
		picture: String
		url: String
		siteName: String
	}

	type UpdateApproval {
		status: String
		message: String
		reviewedAt: DateTime
	}

	type Update {
		id: String!
		election: Election
		candidate: Candidate
		showOnHome: Boolean
		title: String
		content: String
		link: UpdateLink
		pictures: [CloudinaryPicture]
		approval: UpdateApproval
	}
`;
