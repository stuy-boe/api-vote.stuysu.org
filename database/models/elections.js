'use strict';
module.exports = (sequelize, DataTypes) => {
	const elections = sequelize.define('elections', {
		publicUrl: DataTypes.STRING,
		name: DataTypes.STRING,
		type: DataTypes.STRING,
		startTime: DataTypes.DATE,
		endTime: DataTypes.DATE,
		visible: DataTypes.BOOLEAN,
		picture: DataTypes.STRING,
		publicResults: DataTypes.BOOLEAN,
		completed: DataTypes.BOOLEAN
	}, {});
	elections.associate = function (models) {
		// associations can be defined here
		elections.hasMany(models.candidates, {foreignKey: "electionId"});
		elections.hasMany(models.allowedGrades, {foreignKey: "electionId"});
		elections.hasMany(models.votes, {foreignKey: "electionId"});
	};
	return elections;
};
