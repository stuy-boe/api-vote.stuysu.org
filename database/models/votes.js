'use strict';
module.exports = (sequelize, DataTypes) => {
	const votes = sequelize.define(
		'votes',
		{
			electionId: DataTypes.INTEGER,
			userHash: DataTypes.STRING,
			grade: DataTypes.INTEGER
		},
		{}
	);
	votes.associate = function (models) {
		// associations can be defined here
		votes.belongsTo(models.elections, {
			foreignKey: 'electionId',
			targetKey: 'id'
		});
		votes.hasMany(models.voteData, {
			foreignKey: 'voteId'
		});
	};
	return votes;
};
