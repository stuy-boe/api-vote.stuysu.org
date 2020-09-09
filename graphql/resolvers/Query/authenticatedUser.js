const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (root, params, { session }) => {
	if (session.signedIn) {
		return User.findOne({ _id: session.userId });
	}
};
