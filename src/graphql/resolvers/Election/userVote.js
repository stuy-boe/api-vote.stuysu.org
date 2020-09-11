const mongoose = require('mongoose');
const Vote = mongoose.model('Vote');

module.exports = (election, args, { jwt }) => {
	if (!jwt) {
		// There's no way to tell if the user has voted if they're not signed in
		return null;
	}

	let idPrefix = '';

	if (election.type === 'runoff') {
		idPrefix = 'r-';
	}

	if (election.type === 'plurality') {
		idPrefix = 'p-';
	}

	const voteId =
		idPrefix +
		crypto
			.createHash('sha256')
			.update(election.id + jwt.user.sub)
			.digest('hex');

	return Vote.idLoader.load(voteId);
};
