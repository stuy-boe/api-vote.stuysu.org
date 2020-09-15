const mongoose = require('mongoose');
const shortid = require('shortid');
const findOneLoader = require('../utils/findOneLoder');
const findManyLoader = require('../utils/findManyLoader');

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
	},
	followers: [
		{
			userId: String
		}
	]
});

CandidateSchema.methods.getElection = function () {
	return mongoose.model('Election').idLoader.load(this.electionId);
};

CandidateSchema.methods.getUpdates = function () {
	return mongoose.model('Update').candidateIdLoader.load(this._id);
};

CandidateSchema.statics.idLoader = findOneLoader('Candidate', '_id');
CandidateSchema.statics.electionIdLoader = findManyLoader(
	'Candidate',
	'electionId'
);

mongoose.model('Candidate', CandidateSchema);
