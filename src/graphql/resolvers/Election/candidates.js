const mongoose = require('mongoose');
const Candidate = mongoose.model('Candidate');

module.exports = election => {
	return Candidate.find({ electionId: election.id }).exec();
};
