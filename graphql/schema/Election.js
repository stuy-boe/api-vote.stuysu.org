const { gql } = require('apollo-server-express');

module.exports = gql`
	type Election {
		id: String
		name: String

		type: String

		start: DateTime
		end: DateTime

		picture: CloudinaryPicture

		complete: Boolean

		allowEdit: Boolean
		allowDelete: Boolean

		# This is only for a plurality election
		numChoices: Int
	}
`;
