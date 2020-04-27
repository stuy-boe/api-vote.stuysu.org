const router = require('express').Router();
const RefusalError = require('./../../../../utils/RefusalError');
const { elections, allowedGrades } = require('./../../../../database');
const electionTypes = ['runoff', 'plurality'];
const allGrades = [9, 10, 11, 12];

router.post('/', async (req, res) => {
	const name = req.body.name.trim() || '';
	const type = req.body.type || '';
	const visible = req.body.visible || true;
	const picture = req.body.picture || '';
	const publicResults = false;
	const completed = false;
	const publicUrl = req.body.publicUrl.trim() || '';
	const grades = Array.isArray(req.body.grades) ? req.body.grades : [];
	let startTime, endTime;

	try {
		startTime = new Date(req.body.startTime);
		endTime = new Date(req.body.endTime);
		startTime.toISOString() && endTime.toISOString();
	} catch (e) {
		throw new RefusalError(
			'Start date/time or end date/time is not valid.',
			'INVALID_TIMES'
		);
	}

	if (!picture) {
		throw new RefusalError(
			'You must provide a valid picture for this election.',
			'INVALID_PICTURE'
		);
	}

	if (!name) {
		throw new RefusalError(
			'A valid name is required to create an election.',
			'INCOMPLETE_FORM'
		);
	}

	if (!electionTypes.includes(type)) {
		throw new RefusalError(
			'That election type is not supported',
			'UNSUPPORTED_ELECTION_TYPE'
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

	for (let x = 0; x < grades.length; x++) {
		const grade = grades[x];

		if (allGrades.includes(grade)) {
			await allowedGrades.create({
				electionId: election.id,
				grade: String(grade)
			});
		}
	}

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
