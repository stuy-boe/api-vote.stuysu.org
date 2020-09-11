module.exports = candidate => {
	if (candidate.electionId) {
		return candidate.getElection();
	}
};
