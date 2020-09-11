const mongoose = require('mongoose');
const shortid = require('shortid');
const findOneLoader = require('../utils/findOneLoder');

const Schema = mongoose.Schema;

const ElectionSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	name: String,
	url: { type: String, unique: true },
	type: { type: String },
	start: Date,
	end: Date,
	picture: {
		publicId: String,
		width: Number,
		height: Number,
		mimetype: String
	},
	allowedGradYears: [Number],
	complete: { type: Boolean, default: false },
	allowEdit: { type: Boolean, default: false },
	allowDelete: { type: Boolean, default: false },
	numChoices: Number
});

ElectionSchema.methods.getCandidates = function () {
	return mongoose.model('Candidate').electionIdLoader.load(this._id);
};

ElectionSchema.methods.getVotes = function () {
	return mongoose.model('Vote').electionIdLoader.load(this._id);
};

ElectionSchema.statics.idLoader = findOneLoader('Election', '_id');

mongoose.model('Election', ElectionSchema);
