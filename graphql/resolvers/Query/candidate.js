const mongoose = require('mongoose');
const Candidate = mongoose.model('Candidate');

module.exports = (root, { id }) => {
	if (id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return null;
		}
		return Candidate.findById(id).exec();
	}
};
