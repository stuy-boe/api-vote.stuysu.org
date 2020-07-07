const router = require('express').Router();
const multer = require('multer');
const fileSizeLimit = 1000000 * 5;
const path = require('path');
const randomString = require('crypto-random-string');
const uploadsFolder = path.resolve(__dirname, './../../../../uploads');
console.log(uploadsFolder);
const fs = require('fs');

const multerUploads = multer({
	dest: uploadsFolder,
	limits: { fileSize: fileSizeLimit }
}).single('image');

const RequestRefusalError = require('../../../../utils/RequestRefusalError');
const cloudinary = require('cloudinary').v2;

router.post('/', multerUploads, async (req, res) => {
	const file = req.file;

	if (!file) {
		throw new RequestRefusalError('No image was provided', 'NO_IMAGE');
	}

	if (!file.mimetype.startsWith('image/')) {
		throw new RequestRefusalError(
			'Only image files can be uploaded',
			'INVALID_TYPE'
		);
	}

	const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || '';

	const randomName = randomString({ length: 8 });
	const filePublicId = `${cloudinaryFolder}/electionPics/${randomName}`;

	await cloudinary.uploader.upload(file.path, { public_id: filePublicId });

	await fs.promises.unlink(file.path);

	res.json({ success: true, payload: { imageUrl: filePublicId } });
});

router.use((err, req, res, next) => {
	const maxFileSizeMB = Math.round(fileSizeLimit / 10000) / 100;

	// If the error is a file size error, catch it and throw a RequestRefusalError
	// in its place Otherwise the error might be a server error and let our 500
	// handler take care of it
	if (err.code === 'LIMIT_FILE_SIZE') {
		throw new RequestRefusalError(
			`That file is too large. The limit is ${maxFileSizeMB}MB.`,
			'LIMIT_FILE_SIZE'
		);
	} else {
		next(err);
	}
});

module.exports = router;
