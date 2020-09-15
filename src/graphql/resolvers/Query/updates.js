const mongoose = require('mongoose');
const Update = mongoose.model('Update');

module.exports = async (root, { electionId, candidateId }) => {
	const queryObj = {};

	if (electionId) {
		queryObj.electionId = electionId;
	}

	if (candidateId) {
		queryObj.candidateId = candidateId;
	}

	let updates = await Update.find(queryObj);

	// Randomize them at first
	for (let x = 0; x < updates.length / 2; x++) {
		const randomIndex = Math.floor(Math.random() * updates.length);

		let temp = updates[x];
		updates[x] = updates[randomIndex];
		updates[randomIndex] = temp;
	}

	// Each candidate should get at least one post near the top
	const priorityUpdates = [];

	// Add all pinned updates to top
	updates = updates.filter(update => {
		if (update.pinned) {
			priorityUpdates.push(update);
			return false;
		}
		return true;
	});

	// Each candidate should get at least one update near the top
	const candidatesAccountedFor = [];
	updates = updates.filter(update => {
		if (
			update.candidateId &&
			!candidatesAccountedFor.includes(update.candidateId)
		) {
			candidatesAccountedFor.push(update.candidateId);
			priorityUpdates.push(update);
			return false;
		}
		return true;
	});

	return priorityUpdates.concat(updates);
};
