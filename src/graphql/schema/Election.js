const { gql } = require('apollo-server-express');

module.exports = gql`
	union Vote = RunoffVote | PluralityVote

	type Election {
		id: String!
		name: String
		url: String
		type: String
		start: DateTime
		end: DateTime
		picture: CloudinaryPicture
		complete: Boolean
		allowEdit: Boolean
		allowDelete: Boolean
		allowedGradYears: [Int!]
		candidates: [Candidate]

		userVote: Vote
		canVote: Boolean

		# This is only for a plurality election
		numChoices: Int
	}
`;
