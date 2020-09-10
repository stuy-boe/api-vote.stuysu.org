const cloudinary = require('cloudinary').v2;

module.exports = pic => {
	return cloudinary.url(pic.publicId, {
		secure: true,
		quality: 'auto',
		flags: 'lossy'
	});
};
