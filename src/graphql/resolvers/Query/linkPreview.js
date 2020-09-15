const getLinkPreview = require('../../../utils/getLinkPreview');

module.exports = (root, { url }, { authenticationRequired }) => {
	authenticationRequired();

	return getLinkPreview(url);
};
