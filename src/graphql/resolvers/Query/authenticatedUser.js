const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (root, params, { jwt }) => {
	if (jwt) {
		return User.findOne({ _id: jwt.user.id });
	}
};
