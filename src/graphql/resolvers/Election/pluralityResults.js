module.exports = async (
	election,
	args,
	{ authenticationRequired, adminRoleRequired }
) => {
	// If the election is not complete only certain people should have access to results
	if (!election.complete) {
		authenticationRequired();
		await adminRoleRequired('elections');
	}

	if (election.type === 'plurality') {
		return await election.calculatePluralityResults();
	}
};
