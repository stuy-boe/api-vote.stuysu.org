const mongoose = require('mongoose');
const Mailer = require('../../../utils/mailer');
const Update = mongoose.model('Update');
const User = mongoose.model('User');
const markdownIt = require('markdown-it')({
	html: false,
	linkify: true
}).disable(['image']);

const { ApolloError, UserInputError } = require('apollo-server-express');
const allowedStatuses = ['approved', 'rejected'];

module.exports = async (
	root,
	{ updateId, status, message },
	{ authenticationRequired, adminRoleRequired }
) => {
	authenticationRequired();
	await adminRoleRequired('updates');

	const update = await Update.findById(updateId);

	if (!update) {
		throw new ApolloError("There's no update with that ID", 'ID_NOT_FOUND');
	}

	if (!allowedStatuses.includes(status)) {
		throw new UserInputError('That status is not valid. ', {
			invalidArgs: ['status']
		});
	}

	if (!update.approval) {
		update.approval = {};
	}

	update.approval.status = status;

	if (message) {
		update.approval.message = message;
	}

	update.approval.reviewedAt = new Date();

	await update.save();

	if (update.approval.status === 'approved') {
		const candidate = await update.getCandidate();
		const election = await candidate.getElection();

		const preview = markdownIt.render(update.content);

		const userIds = candidate?.followers?.map(follower => follower.userId);

		const emailPromises = [];

		if (userIds?.length) {
			const followers = await User.find({
				_id: { $in: userIds }
			}).exec();

			followers.forEach(user => {
				emailPromises.push(
					Mailer.sendEmailTemplate(
						'updateNotification.html',
						{
							update,
							candidate,
							election,
							preview,
							user
						},
						{
							to: user.email,
							subject: `${candidate.name} posted an update | StuyBOE Voting Site`
						}
					)
				);
			});
		}

		// Don't wait for the emails to finish sending as of right now.
		// It may take longer than expected
		// await Promise.all(emailPromises);
	}

	return update;
};
