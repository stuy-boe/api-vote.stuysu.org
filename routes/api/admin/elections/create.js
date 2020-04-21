const router = require('express').Router();
const RefusalError = require('./../../../../utils/RefusalError');
const { elections } = require('./../../../../database');
const electionTypes = ['runoff', 'plurality'];

router.post('/', async (req, res) => {
	const name = req.body.name.trim() || '';
	const type = req.body.type || '';
	const startTime = new Date(req.body.startTime);
	const endTime = new Date(req.body.endTime);
	const visible = req.body.visible || true;
	const picture = req.body.picture || '';
	const publicResults = false;
	const completed = false;
	const publicUrl = req.body.publicUrl.trim() || '';

	if (!name) {
		throw new RefusalError(
			'A valid name is required to create an election.',
			'INCOMPLETE_FORM'
		);
	}

	if (electionTypes.includes(type)) {
		throw new RefusalError(
			'That election type is not supported',
			'UNSUPPORTED_ELECTION_TYPE'
		);
	}

	if (!startTime.getTime() || !endTime.getTime()) {
		throw new RefusalError(
			'Start time or end time is not valid.',
			'INVALID_TIMES'
		);
	}

	const publicUrlExists = await elections.count({ where: { publicUrl } });

	if (!publicUrl || publicUrlExists) {
		throw new RefusalError(
			'There already exists an election with that public url.',
			'URL_EXISTS'
		);
	}

	const election = await elections.create({
		publicUrl,
		name,
		type,
		startTime,
		endTime,
		visible,
		picture,
		publicResults,
		completed
	});

	res.json({
		success: true,
		payload: {
			election: {
				id: election.id,
				publicUrl: election.publicUrl
			}
		}
	});
});

module.exports = router;
