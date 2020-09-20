const mongoose = require('mongoose');
const uploadPicStream = require('../../../utils/uploadPicStream');
const shortid = require('shortid');
const { CLOUDINARY_PREFIX } = require('../../../constants');
const { UserInputError } = require('apollo-server-express');
const Candidate = mongoose.model('Candidate');

module.exports = async (
	root,
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

	candidate.profilePic = {
		publicId: file.public_id,
		width: file.width,
		height: file.height,
		mimetype: pic.mimetype
	};

	await candidate.save();

	return candidate;
};
