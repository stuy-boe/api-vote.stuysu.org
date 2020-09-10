const cloudinary = require('cloudinary').v2;

module.exports = pic => {
	return cloudinary.url({
		public_id: pic.publicId,
		secure: true,
		quality: 'auto'
	});
};
