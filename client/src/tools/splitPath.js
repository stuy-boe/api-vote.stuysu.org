export const splitPath = (url, toLower = false) => {
	if (toLower) url = url.toLowerCase();
	return url.split('/').filter(i => Boolean(i));
};
