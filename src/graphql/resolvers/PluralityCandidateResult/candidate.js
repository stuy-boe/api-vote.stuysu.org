const mongoose = require('mongoose');
const Candidate = mongoose.model('Candidate');
module.exports = result => {
	return Candidate.idLoader.load(result.candidate);
};
