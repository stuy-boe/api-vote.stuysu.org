const normalizeUrl = require('normalize-url');
const ogs = require('open-graph-scraper');
const { resolve: resolveUrl } = require('url');

const getLinkPreview = url => {
	const normalizedUrl = normalizeUrl(url);

	return new Promise(resolve => {
		ogs(
			{
				url: normalizedUrl,
				// for some reason a timeout of 1000 equates to a timeout of 6 seconds
				timeout: 1000,
				headers: { 'user-agent': 'googlebot' }
			},
			(error, results) => {
				const title = results?.ogTitle;
				const description = results?.ogDescription;
				const url = results?.requestUrl;
				const ogImage = results?.ogImage?.url;

				const image = ogImage ? resolveUrl(
					results?.requestUrl,
					results?.ogImage?.url
				) : undefined;
				const siteName = results?.ogSiteName;

				resolve({
					title,
					description,
					url,
					image,
					siteName
				});
			}
		);
	});
};

module.exports = getLinkPreview;
