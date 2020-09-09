const mongoose = require('mongoose');
const Candidate = mongoose.model('Candidate');

module.exports = (root, { id, url }) => {
	if (id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return null;
		}
		return Candidate.findById(id).exec();
	}

	if (url) {
		return Candidate.findOne({ url }).exec();
	}
};
