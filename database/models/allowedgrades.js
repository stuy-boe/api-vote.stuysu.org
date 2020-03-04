'use strict';
module.exports = (sequelize, DataTypes) => {
	const allowedGrades = sequelize.define('allowedGrades', {
		electionId: DataTypes.INTEGER,
		grade: DataTypes.STRING
	}, {});
	allowedGrades.associate = function (models) {
		// associations can be defined here
	};
	return allowedGrades;
};
