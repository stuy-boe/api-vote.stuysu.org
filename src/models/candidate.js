const mongoose = require('mongoose');
const shortid = require('shortid');

const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	electionId: String,
	name: String,
	url: String,
	profilePic: {
		publicId: String,
		width: Number,
		height: Number,
		mimetype: String
	},
	coverPic: {
		publicId: String,
		width: Number,
		height: Number,
		mimetype: String
	},
	active: Boolean,
	social: {
		facebook: String,
		website: String,
		email: String,
		instagram: String
	}
});

mongoose.model('Candidate', CandidateSchema);
