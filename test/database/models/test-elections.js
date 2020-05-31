const {
	elections,
	allowedGrades,
	votes,
	Sequelize
} = require('./../../../database');
const shortHash = require('./../../../utils/shortHash');
const { expect } = require('chai');

const generateString = require('crypto-random-string');

const now = new Date();

describe('elections', () => {
	let afterVotingElection, activelyVotingElection, beforeVotingElection;

	before(async () => {
		// insert some test rows

		afterVotingElection = await elections.create({
			publicUrl: generateString({ length: 30 }),
			name: 'Currently Voting Election',
			type: 'runoff',

			// start time and end time are in the past
			startTime: new Date(now.getTime() - 86400 * 1000),
			endTime: new Date(now.getTime() - 3600 * 1000),

			visible: true,
			picture: '',
			publicResults: true,
			completed: false
		});

		activelyVotingElection = await elections.create({
			publicUrl: generateString({ length: 30 }),
			name: 'Expired Election',
			type: 'runoff',

			// start time is in past, end time is in future
			startTime: new Date(now.getTime() - 86400 * 1000),
			endTime: new Date(now.getTime() + 3600 * 1000),

			visible: true,
			picture: '',
			publicResults: true,
			completed: false
		});

		beforeVotingElection = await elections.create({
			publicUrl: generateString({ length: 30 }),
			name: 'Expired Election',
			type: 'runoff',

			// start time and end time are in the future
			startTime: new Date(now.getTime() + 3600 * 1000),
			endTime: new Date(now.getTime() + 8640000 * 1000),

			visible: true,
			picture: '',
			publicResults: true,
			completed: false
		});
	});

	describe('#isVotingPeriod', () => {
		it('should return false when it is not the voting period', async () => {
			expect(await beforeVotingElection.isVotingPeriod()).to.be.false;
			expect(await afterVotingElection.isVotingPeriod()).to.be.false;
		});

		it('should return true when it is the voting period', async () => {
			expect(await activelyVotingElection.isVotingPeriod()).to.be.true;
		});
	});

	describe('#existsVote', () => {
		let fakeVote;

		const fakeUserId = generateString({ length: 16 });
		before(async () => {
			const userHash = shortHash(fakeUserId + activelyVotingElection.id);
			fakeVote = await votes.create({
				electionId: activelyVotingElection.id,
				userHash,
				grade: 9
			});
		});

		it('should be return true when a vote from a specific user exists for an election', async () => {
			expect(await activelyVotingElection.existsVote(fakeUserId)).to.be
				.true;
		});

		it('should return false when a vote does not exist from a specific user for an election', async () => {
			expect(await beforeVotingElection.existsVote(fakeUserId)).to.be
				.false;
			expect(await afterVotingElection.existsVote(fakeUserId)).to.be
				.false;
		});

		after(async () => {
			await fakeVote.destroy();
		});
	});

	describe('#includesGrade', () => {
		const testGrade = 11;
		let fakeAllowedGrade;

		before(async () => {
			fakeAllowedGrade = await allowedGrades.create({
				electionId: activelyVotingElection.id,
				grade: testGrade
			});
		});

		it('should return true if a certain grade is allowed to vote for an election', async () => {
			expect(await activelyVotingElection.includesGrade(testGrade)).to.be
				.true;
		});

		it('should return false if a certain grade is not allowed to vote for an election', async () => {
			expect(await beforeVotingElection.includesGrade(testGrade)).to.be
				.false;
		});

		after(async () => {
			fakeAllowedGrade.destroy();
		});
	});

	after(async () => {
		// Delete the test rows that we created
		await activelyVotingElection.destroy();
		await beforeVotingElection.destroy();
		await afterVotingElection.destroy();
	});
});
