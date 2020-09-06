const mongoose = require('mongoose');
const shortid = require('shortid');

const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	name: String,
	url: String,
	picture: {
		publicId: String,
		defaultUrl: String
	},
	active: Boolean
});

mongoose.model('Candidate', CandidateSchema);
