const mongoose = require('mongoose');
const Update = mongoose.model('Update');

module.exports = (root, { electionId, candidateId }) => {
	return Update.find({ electionId, candidateId });
};
