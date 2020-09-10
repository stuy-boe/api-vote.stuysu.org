const calcGrade = require('../../../utils/calcGrade');

module.exports = (user, args, { authenticationRequired }) => {
	authenticationRequired(['grade']);

	if (typeof user.gradYear !== 'number') {
		return null;
	}

	return calcGrade(user.gradYear);
};
