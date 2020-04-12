const router = require('express').Router();
const {
	students,
	votes,
	voteData
} = require('../../../../database');
const RefusalError = require('./../../../../utils/RefusalError');
const shortHash = require('./../../../../utils/shortHash');

// Middleware to determine if a user can vote before processing the vote
router.use('*', async (req, res, next) => {
	if (!req.session.signedIn) {
		throw new RefusalError(
			'You need to be signed in to vote.',
			'NOT_AUTHENTICATED'
		);
	}

	if (!req.election.isVotingPeriod()) {
		throw new RefusalError(
			'It is not currently the voting period for this election.',
			'NOT_VOTING_PERIOD'
		);
	}

	const grade = students.getGrade(req.session.email);

	if (!grade) {
		throw new RefusalError(
			'Your grade is unknown and so you are not yet allowed to vote.',
			'GRADE_UNKNOWN'
		);
	}

	if (!(await req.election.includesGrade(grade))) {
		throw new RefusalError(
			'You are not allowed to vote for this election.',
			'NOT_ALLOWED'
		);
	}

	if (
		await req.election.existsVote(
			req.session.getDecryptedUserId()
		)
	) {
		throw new RefusalError(
			'You have already voted for this election.',
			'ALREADY_VOTED'
		);
	}

	next();
});

router.get('/', (req, res) => {
	res.json({ success: true });
});

router.post('/', async (req, res) => {
	const choices = req.body.choices || [];

	if (!Array.isArray(choices)) {
		throw new RefusalError(
			'The choices were not sent in a way that the server can understand.',
			'INVALID_FORMAT'
		);
	}

	if (!Boolean(choices.length)) {
		throw new RefusalError(
			'You must choose at least one candidate to vote for.',
			'INSUFFICIENT_SELECTIONS'
		);
	}

	const candidates = await req.election.getCandidates();
	const validChoices = [];

	for (let x = 0; x < choices.length; x++) {
		const choice = choices[x];
		const choiceExists = candidates.some(
			candidate => candidate.id === choice
		);

		if (
			choiceExists &&
			!validChoices.includes(choice)
		) {
			validChoices.push(choice);
		}
	}

	const grade = students.getGrade(req.session.email);

	const voteId = await votes.create({
		electionId: req.election.id,
		userHash: shortHash(
			req.session.getDecryptedUserId() +
				req.election.id
		),
		grade
	});

	for (
		let choiceNumber = 0;
		choiceNumber < choices.length;
		choiceNumber++
	) {
		const choice = choices[choiceNumber];

		await voteData.create({
			voteId,
			choiceNumber,
			data: choice
		});
	}

	await res.json({ success: true });
});

module.exports = router;
