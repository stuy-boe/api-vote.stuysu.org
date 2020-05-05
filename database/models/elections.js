'use strict';
const shortHash = require('./../../utils/shortHash');

module.exports = (sequelize, DataTypes) => {
	const elections = sequelize.define(
		'elections',
		{
			publicUrl: DataTypes.STRING,
			name: DataTypes.STRING,
			type: DataTypes.STRING,
			startTime: DataTypes.DATE,
			endTime: DataTypes.DATE,
			visible: DataTypes.BOOLEAN,
			picture: DataTypes.STRING,
			publicResults: DataTypes.BOOLEAN,
			completed: DataTypes.BOOLEAN
		},
		{}
	);

	elections.associate = function (models) {
		// associations can be defined here
		elections.hasMany(models.candidates, {
			foreignKey: 'electionId'
		});
		elections.hasMany(models.allowedGrades, {
			foreignKey: 'electionId'
		});
		elections.hasMany(models.votes, {
			foreignKey: 'electionId'
		});
	};

	elections.prototype.isVotingPeriod = function () {
		const now = new Date();
		return this.startTime <= now && now < this.endTime;
	};

	elections.prototype.existsVote = async function (userId) {
		const userHash = shortHash(userId + this.id);
		const userVotes = await this.getVotes({
			where: { userHash }
		});

		return userVotes.length;
	};

	elections.prototype.includesGrade = async function (grade) {
		const allowedGrades = await this.getAllowedGrades({
			where: grade
		});

		return Boolean(allowedGrades.length);
	};

	return elections;
};
