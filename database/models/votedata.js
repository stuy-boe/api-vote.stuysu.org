'use strict';
module.exports = (sequelize, DataTypes) => {
	const voteData = sequelize.define('voteData', {
		voteId: DataTypes.INTEGER,
		choiceNumber: DataTypes.INTEGER,
		data: DataTypes.STRING
	}, {});
	voteData.associate = function (models) {
		// associations can be defined here
		voteData.belongsTo(models.votes, {foreignKey: "voteId", targetKey: "id"});
	};
	return voteData;
};
