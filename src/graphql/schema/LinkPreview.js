const { gql } = require('apollo-server-express');

module.exports = gql`
	type LinkPreviewVideo {
		url: String
		secureUrl: String
		type: String
		width: Int
		height: Int
	}

	type LinkPreview {
		url: String!
		title: String
		siteName: String
		description: String
		images: [String]
		mediaType: String
		contentType: String
		videos: [LinkPreviewVideo]
		favicons: [String]
	}
`;
