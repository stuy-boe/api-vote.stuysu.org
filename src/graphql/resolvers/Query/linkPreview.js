const getLinkPreview = require('../../../utils/getLinkPreview');

module.exports = (root, { url }, { authenticationRequired }) => {
	// Require login to prevent abuse
	authenticationRequired();

	return getLinkPreview(url);
};
