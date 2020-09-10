const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (root, { id, email }) => {
	if (id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return null;
		}
		return User.findById(id).exec();
	}

	if (email) {
		return User.findOne({ email }).exec();
	}
};
