const mongoose = require('mongoose');
const shortid = require('shortid');
const uploadPicStream = require('../../../utils/uploadPicStream');
const { UserInputError } = require('apollo-server-express');
const Candidate = mongoose.model('Candidate');
const { CLOUDINARY_PREFIX } = require('../../../constants');

module.exports = async (
	parent,
	{ candidateId, picture },
	{ authenticationRequired, candidateManagerRequired }
) => {
	authenticationRequired();
	await candidateManagerRequired(candidateId);
	const pic = await picture;

	const candidate = Candidate.findById(candidateId);

	if (!pic.mimetype || !pic.mimetype.startsWith('image/')) {
		throw new UserInputError(
			'Only image files can be uploaded as the picture.',
			{
				invalidArgs: ['picture']
			}
		);
	}

	const file = await uploadPicStream(
		pic,
		`${CLOUDINARY_PREFIX}/${candidate.electionId}/${
			candidate.id
		}/${shortid.generate()}`
	);

	candidate.coverPic = {
		publicId: file.public_id,
		width: file.width,
		height: file.height,
		mimetype: pic.mimetype
	};

	await candidate.save();

	return candidate;
};
