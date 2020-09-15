const { gql } = require('apollo-server-express');

module.exports = gql`
	type Election {
		id: String!
		name: String
		url: String
		type: String
		start: DateTime
		end: DateTime
		picture: CloudinaryPicture
		complete: Boolean
		allowedGradYears: [Int!]
		candidates: [Candidate]

		updates: [Update]

		votes: [Vote]
		runoffResults: RunoffResult
		pluralityResults: PluralityResult

		hasVoted: Boolean

		# This is only for a plurality election
		numChoices: Int
	}
`;
