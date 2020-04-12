'use strict';
module.exports = (sequelize, DataTypes) => {
	const voteData = sequelize.define(
		'voteData',
		{
			voteId: DataTypes.INTEGER,
			choiceNumber: DataTypes.INTEGER,
			candidateId: DataTypes.INTEGER
		},
		{}
	);
	voteData.associate = function (models) {
		// associations can be defined here
		voteData.belongsTo(models.votes, {
			foreignKey: 'voteId',
			targetKey: 'id'
		});
	};
	return voteData;
};
