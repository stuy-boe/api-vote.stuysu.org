const mongoose = require('mongoose');
const findManyLoader = require('../utils/findManyLoader');

const Schema = mongoose.Schema;

const VoteSchema = new Schema({
	_id: {
		type: String,
		required: true
	},
	electionId: String,
	grade: Number,
	choices: [String]
});

VoteSchema.methods.getElection = function () {
	return mongoose.model('Election').idLoader.load(this.electionId);
};

VoteSchema.methods.getChoices = function () {
	const Candidate = mongoose.model('Candidate');

	return Promise.all(
		this.choices.map(candidateId => Candidate.idLoader.load(candidateId))
	);
};

VoteSchema.statics.electionIdLoader = findManyLoader('Vote', 'electionId');

mongoose.model('Vote', VoteSchema);
