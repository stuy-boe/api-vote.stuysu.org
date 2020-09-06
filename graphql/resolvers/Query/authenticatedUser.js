const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (root, params, { session }) => {
	if (session.signedIn) {
		return User.findById(session.userId);
	}
};
