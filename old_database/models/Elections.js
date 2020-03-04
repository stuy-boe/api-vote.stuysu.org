const {Elections, Votes, VoteData} = require("./../index");
const crypto = require("crypto");

Elections.prototype.isAllowedGrade = async function(grade) {
	return Boolean(
		(await this.getAllowedGrades({where: {grade}})).length
	);
};

Elections.prototype.isVotingPeriod = function() {
	const now = new Date();
	return this.startTime <= now && now < this.endTime;
};

Elections.prototype.generateUserHash = function(user_id){
	return crypto.createHash('sha256').update(user_id + this.id).digest('hex').substr(0, 16);
};

Elections.prototype.hasVoted = async function(user_id){
	const userHash = this.generateUserHash(user_id);
	return Boolean(await Votes.findOne({where: {userHash}}));
};

Elections.prototype.cleanChoices = async function(choices){
	const candidates = this.getCandidates();
	const cleanChoices = [];

	for(let x = 0; x < choices.length ; x++){
		const choice = choices[x];
		const choiceExists = candidates.some(candidate => candidate.id === choice);

		if(choiceExists && ! cleanChoices.includes(choice)){
			cleanChoices.push(choice);
		}
	}

	return cleanChoices;
};

Elections.prototype.storeVote = async function(user_id, grade, choices){
	const voteId = await Votes.create({
		electionId: this.id,
		userHash: this.generateUserHash(user_id),
		grade
	});

	for(let choiceNumber = 0; choiceNumber < choices.length; choiceNumber++){
		const choice = choices[choiceNumber];

		await VoteData.create({
			voteId,
			choiceNumber,
			data: choice
		});
	}

	return voteId;
};

module.exports = Elections;
