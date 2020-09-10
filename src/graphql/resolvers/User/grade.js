const calcGrade = require('../../../utils/calcGrade');

module.exports = user => {
	if (typeof user.gradYear !== 'number') {
		return null;
	}

	return calcGrade(user.gradYear);
};
