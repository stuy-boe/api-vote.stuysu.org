const mongoose = require('mongoose');
const Update = mongoose.model('Update');

const { ApolloError } = require('apollo-server-express');

module.exports = async (
	root,
	{ updateId, status, message },
	{ authenticationRequired, adminRoleRequired }
) => {
	authenticationRequired();
	await adminRoleRequired('updates');

	const update = Update.findById(updateId);

	if (!update) {
		throw new ApolloError("There's no update with that ID", 'ID_NOT_FOUND');
	}

	update.approval.status = status;

	if (message) {
		update.approval.message = message;
	}

	update.approval.reviewedAt = new Date();

	await update.save();

	return update;
};
