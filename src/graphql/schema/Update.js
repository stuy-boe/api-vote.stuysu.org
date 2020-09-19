const { gql } = require('apollo-server-express');

module.exports = gql`
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
		official: Boolean
		pinned: Boolean
		link: LinkPreview
		pictures: [CloudinaryPicture]
		approval: UpdateApproval
		createdAt: DateTime
	}
`;
