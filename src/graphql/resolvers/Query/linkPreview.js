const { getLinkPreview } = require('link-preview-js');
const normalizeUrl = require('normalize-url');

module.exports = (root, { url }, { authenticationRequired }) => {
	// Require login to prevent abuse
	authenticationRequired();
	let resolved = false;

	url = normalizeUrl(url);

	return new Promise(resolve => {
		setTimeout(() => {
			// If the result isn't returned in 5 seconds just send null to the user
			// The function doesn't give us a way to set a timeout directly
			if (!resolved) {
				resolved = true;
				resolve(null);
			}
		}, 5000);

		getLinkPreview(url, {
			headers: {
				'user-agent': 'googlebot',
				'Accept-Language': 'en-US',
				'Keep-Alive': 'timeout=5, max=5'
			}
		})
			.then(data => {
				if (!resolved) {
					resolved = true;
					resolve(data);
				}
			})
			.catch(er => {
				if (!resolved) {
					resolved = true;
					resolve(null);
				}
			});
	});
};
