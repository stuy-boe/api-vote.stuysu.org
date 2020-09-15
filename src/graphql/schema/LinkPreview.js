const { gql } = require('apollo-server-express');

module.exports = gql`	
	type LinkPreview {
		url: String!
		title: String
		siteName: String
		description: String
		image: String,
	}
`;
