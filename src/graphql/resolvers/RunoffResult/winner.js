const mongoose = require('mongoose');
const Candidate = mongoose.model('Candidate');
module.exports = result => {
	if (result.winner) {
		return Candidate.idLoader.load(result.winner);
	}
};
