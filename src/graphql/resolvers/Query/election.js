const mongoose = require('mongoose');
const Election = mongoose.model('Election');

module.exports = (root, { id, url }) => {
	if (id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return null;
		}
		return Election.findById(id).exec();
	}

	if (url) {
		return Election.findOne({ url }).exec();
	}
};
