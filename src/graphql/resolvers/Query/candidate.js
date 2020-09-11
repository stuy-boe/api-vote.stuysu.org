const mongoose = require('mongoose');
const Candidate = mongoose.model('Candidate');

module.exports = (root, { id }) => {
	if (id) {
		return Candidate.findById(id).exec();
	}
};
