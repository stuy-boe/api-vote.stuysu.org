const mongoose = require('mongoose');
const Update = mongoose.model('Update');

module.exports = (root, { electionId, candidateId }) => {
	const queryObj = {};

	if (electionId) {
		queryObj.electionId = electionId;
	}

	if (candidateId) {
		queryObj.candidateId = candidateId;
	}

	return Update.find(queryObj);
};
