module.exports = (root, { id }, context) => {
	return context.models.users.findOne({ where: { id } });
};
