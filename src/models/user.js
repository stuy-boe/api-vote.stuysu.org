const mongoose = require('mongoose');
const shortid = require('shortid');
const findOneLoader = require('../utils/findOneLoder');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	email: { type: String, default: '' },
	gradYear: { type: Number, required: false },
	adminRoles: [String],

	// An array of ids of candidates that they are managers for
	candidatesManaged: [String]
});

UserSchema.statics.idLoader = findOneLoader('User', '_id');

UserSchema.methods.getCandidatesManaged = function () {
	if (!this.candidatesManaged) {
		return [];
	}

	const Candidate = mongoose.model('Candidate');

	return Promise.all(
		this.candidatesManaged.map(candidateId =>
			Candidate.idLoader.load(candidateId)
		)
	);
};

mongoose.model('User', UserSchema);
