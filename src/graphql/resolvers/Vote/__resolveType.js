module.exports = vote => {
	if (vote.id.startsWith('r-')) {
		return 'RunoffVote';
	}

	if (vote.id.startsWith('p-')) {
		return 'PluralityVote';
	}

	return null;
};
