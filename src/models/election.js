const mongoose = require('mongoose');
const shortid = require('shortid');
const findOneLoader = require('../utils/findOneLoder');

const Schema = mongoose.Schema;

const ElectionSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	name: String,
	url: { type: String, unique: true },
	type: { type: String },
	start: Date,
	end: Date,
	picture: {
		publicId: String,
		width: Number,
		height: Number,
		mimetype: String
	},
	runoffVotes: {
		type: [
			{
				grade: Number,
				choices: [String]
			}
		],
		select: false
	},
	pluralityVotes: {
		type: [
			{
				grade: Number,
				choices: [String]
			}
		],
		select: false
	},
	allowedGradYears: [Number],
	complete: { type: Boolean, default: false },
	numChoices: Number
});

ElectionSchema.methods.getCandidates = function () {
	return mongoose.model('Candidate').electionIdLoader.load(this._id);
};

ElectionSchema.methods.getUpdates = function () {
	return mongoose.model('Update').electionIdLoader.load(this._id);
};

ElectionSchema.methods.calculateRunoffResults = async function () {
	let votes = this.runoffVotes;
	if (!votes) {
		let election = await ElectionSchema.findOne({ _id: this._id })
			.select('+runoffVotes')
			.exec();

		votes = election.runoffVotes;
	}

	const numEligibleVoters = await mongoose.model('User').count({
		gradYear: { $in: this.allowedGradYears }
	});
	const candidates = await mongoose
		.model('Candidate')
		.electionIdLoader.load(this._id);

	const rounds = [];
	let winner = null;
	let isTie = false;
	let numPeopleVoted = votes.length;

	const eliminated = [];

	if (votes.length > 0) {
		let complete = false;
		let number = 0;
		while (!complete) {
			number++;
			let numVotesThisRound = 0;

			let voteCountsThisRound = {};

			if (number === 1) {
				candidates.forEach(candidate => {
					voteCountsThisRound[candidate._id] = 0;
				});
			}

			const eliminatedThisRound = [];

			votes.forEach(vote => {
				const activeVote = vote.choices.find(
					choice => !eliminated.includes(choice)
				);

				if (activeVote) {
					numVotesThisRound++;
					// init counter if not already done this round
					if (!voteCountsThisRound[activeVote]) {
						voteCountsThisRound[activeVote] = 0;
					}

					voteCountsThisRound[activeVote]++;
				}
			});

			const candidateIdsThisRound = Object.keys(voteCountsThisRound);

			let minVotes = voteCountsThisRound[candidateIdsThisRound[0]];

			candidateIdsThisRound.forEach(candidateId => {
				const currentCandidateNumVotes =
					voteCountsThisRound[candidateId];

				if (currentCandidateNumVotes < minVotes) {
					minVotes = currentCandidateNumVotes;
				}
			});

			const results = candidateIdsThisRound.map(id => {
				const candidateNumVotesThisRound = voteCountsThisRound[id];
				const isEliminated = candidateNumVotesThisRound === minVotes;
				const percentage =
					Math.round(
						(candidateNumVotesThisRound * 10000) / numVotesThisRound
					) / 100;

				if (isEliminated) {
					eliminated.push(id);
					eliminatedThisRound.push(id);
				}

				if (percentage >= 50) {
					if (winner) {
						// This means a tie
						winner = null;
						complete = false;
						isTie = true;
					} else {
						winner = id;
						complete = true;
						isTie = false;
					}
				}

				return {
					candidate: id,
					eliminated: isEliminated,
					percentage,
					numVotes: candidateNumVotesThisRound
				};
			});

			if (numVotesThisRound) {
				rounds.push({
					number,
					numVotes: numVotesThisRound,
					results,
					eliminatedCandidates: eliminatedThisRound
				});
			} else {
				complete = true;
			}
		}
	}

	return {
		rounds,
		winner,
		numPeopleVoted,
		isTie,
		numEligibleVoters
	};
};

ElectionSchema.methods.calculatePluralityResults = async function () {
	let votes = this.pluralityVotes;
	if (!votes) {
		let election = await ElectionSchema.findOne({ _id: this._id })
			.select('+pluralityVotes')
			.exec();

		votes = election.runoffVotes;
	}
	const numEligibleVoters = await mongoose.model('User').count({
		gradYear: { $in: this.allowedGradYears }
	});

	let winner = null;
	let isTie = false;

	const candidates = await mongoose
		.model('Candidate')
		.electionIdLoader.load(this._id);

	const candidateVoteMap = {};

	candidates.forEach(candidate => {
		candidateVoteMap[candidate._id] = 0;
	});

	let numVotes = 0;
	const numPeopleVoted = votes.length;

	votes.forEach(vote => {
		vote.choices.forEach(id => {
			candidateVoteMap[id]++;
			numVotes++;
		});
	});

	let mostVotes = 0;

	const results = candidates.map(candidate => {
		const voteCount = candidateVoteMap[candidate._id];

		if (voteCount === mostVotes) {
			isTie = true;
			winner = null;
		}

		if (voteCount > mostVotes) {
			isTie = false;
			winner = candidate._id;
		}

		return {
			candidate: candidate._id,
			numVotes: voteCount,
			percentage: Math.floor((voteCount * 10000) / numVotes) / 100
		};
	});

	return {
		winner,
		isTie,
		results,
		numVotes,
		numPeopleVoted,
		numEligibleVoters
	};
};

ElectionSchema.statics.idLoader = findOneLoader('Election', '_id');

mongoose.model('Election', ElectionSchema);
