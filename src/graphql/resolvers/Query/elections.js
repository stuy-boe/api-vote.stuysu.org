const mongoose = require('mongoose');
const Election = mongoose.model('Election');

module.exports = () => {
	return Election.find().exec();
};
