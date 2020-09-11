const normalizeUrl = require('normalize-url');
const { getLinkPreview: getPreview } = require('link-preview-js');

const getLinkPreview = url => {
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

		getPreview(url, {
			imagesPropertyType: 'og',
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

module.exports = getLinkPreview;
