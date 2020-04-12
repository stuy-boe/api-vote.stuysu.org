const crypto = require('crypto');

const shortHash = str => {
	return crypto
		.createHash('sha256')
		.update(str)
		.digest('hex')
		.substr(0, 16);
};

module.exports = shortHash;
