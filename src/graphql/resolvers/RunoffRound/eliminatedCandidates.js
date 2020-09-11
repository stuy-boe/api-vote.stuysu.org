const mongoose = require('mongoose');
const Candidate = mongoose.model('Candidate');
module.exports = round => {
	return Promise.all(
		round.eliminatedCandidates.map(id => Candidate.idLoader.load(id))
	);
};
