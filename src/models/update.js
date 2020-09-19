const mongoose = require('mongoose');
const shortid = require('shortid');
const findOneLoader = require('../utils/findOneLoder');
const findManyLoader = require('../utils/findManyLoader');

const Schema = mongoose.Schema;

const UpdateSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	electionId: String,
	candidateId: String,
	showOnHome: Boolean,
	title: String,
	content: String,
	link: {
		title: String,
		description: String,
		image: String,
		url: String,
		siteName: String
	},
	pictures: [
		{
			publicId: String,
			width: Number,
			height: Number,
			mimetype: String
		}
	],
	official: Boolean,
	pinned: Boolean,
	// Status is either 'approved', 'rejected', or 'pending'
	approval: {
		status: String,
		message: String,
		reviewedAt: Date
	},
	createdAt: Date
});

UpdateSchema.statics.idLoader = findOneLoader('Update', '_id');
UpdateSchema.statics.electionIdLoader = findManyLoader('Update', 'electionId');
UpdateSchema.statics.candidateIdLoader = findManyLoader(
	'Update',
	'candidateId',
	{},
	[null, { sort: { createdAt: 'desc' } }]
);

UpdateSchema.methods.getElection = function () {
	if (!this.electionId) {
		return null;
	}

	return mongoose.model('Election').idLoader.load(this.electionId);
};

UpdateSchema.methods.getCandidate = function () {
	if (!this.candidateId) {
		return null;
	}

	return mongoose.model('Candidate').idLoader.load(this.candidateId);
};

mongoose.model('Update', UpdateSchema);
