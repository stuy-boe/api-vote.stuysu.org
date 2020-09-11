const mongoose = require('mongoose');
const getLinkPreview = require('../../../utils/getLinkPreview');
const uploadPicStream = require('../../../utils/uploadPicStream');
const { CLOUDINARY_PREFIX } = require('../../../constants');
const Update = mongoose.model('Update');
const Candidate = mongoose.model('Candidate');
const { UserInputError } = require('apollo-server-express');
const shortid = require('shortid');

module.exports = async (
	root,
	{ title, content, link, pictures, candidateId },
	{ jwt, authenticationRequired, candidateManagerRequired }
) => {
	authenticationRequired();
	await candidateManagerRequired(candidateId);

	if (!title) {
		throw new UserInputError('The title field cannot be left empty', {
			invalidArgs: ['title']
		});
	}

	if (!content) {
		throw new UserInputError('The content field cannot be left empty.', {
			invalidArgs: ['content']
		});
	}

	const candidate = await Candidate.idLoader.load(candidateId);

	const linkPreview = await getLinkPreview(link);

	if (linkPreview) {
		const { title, description, siteName, images } = linkPreview;
		link = {
			title,
			description,
			siteName,
			picture: (images || [])[0]
		};
	} else {
		link = undefined;
	}

	const uploadedPics = [];

	if (pictures) {
		pictures = await pictures;

		for (let i = 0; i < pictures.length; i++) {
			const pic = await pictures[i];
			if (!pic.mimetype || !pic.mimetype.startsWith('image/')) {
				throw new UserInputError(
					'Only image files can be uploaded as the picture.',
					{
						invalidArgs: ['pictures']
					}
				);
			}

			const file = await uploadPicStream(
				pic,
				`${CLOUDINARY_PREFIX}/${candidate.electionId}/${
					candidate.id
				}/${shortid.generate()}`
			);

			uploadedPics.push({
				publicId: file.public_id,
				width: file.width,
				height: file.height,
				mimetype: pic.mimetype
			});
		}
	}

	return await Update.create({
		electionId: candidate.electionId,
		candidateId: candidate._id,
		showOnHome: true,
		title,
		content,
		link,
		pictures: uploadedPics,
		// Status is either 'approved', 'rejected', or 'pending'
		approval: {
			status: 'pending'
		},
		createdAt: new Date()
	});
};
