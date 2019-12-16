const getOGTitle = (path) => {
	return "title";
};

const getOGType = (path) => {
	return "type";
};

const getOGUrl = (path) => {
	return "url";
};

const getOGImage = (path) => {
	return "image";
};

const placeholders = {
	_OG_TITLE_: getOGTitle,
	_OG_TYPE_: getOGType,
	_OG_URL_: getOGUrl,
	_OG_IMAGE_: getOGImage
};

const fillPlaceholders = (file, path) => {
	let index_file = file;

	Object.keys(placeholders).forEach((name) => {
		let getter = placeholders[name];
		index_file = index_file.replace(name, getter(path));
	});

	return index_file;
};

module.exports = {
	fillPlaceholders
};
