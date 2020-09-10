const mongoose = require('mongoose');
const Election = mongoose.model('Election');

module.exports = candidate => {
	if (candidate.electionId) {
		return Election.findById(candidate.electionId);
	}
};
