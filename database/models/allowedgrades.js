'use strict';
module.exports = (sequelize, DataTypes) => {
	const allowedGrades = sequelize.define(
		'allowedGrades',
		{
			electionId: DataTypes.INTEGER,
			grade: DataTypes.INTEGER
		},
		{}
	);
	allowedGrades.associate = function (models) {
		// associations can be defined here
		allowedGrades.belongsTo(models.elections, {
			foreignKey: 'electionId',
			targetKey: 'id'
		});
	};
	return allowedGrades;
};
