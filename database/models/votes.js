'use strict';
module.exports = (sequelize, DataTypes) => {
	const votes = sequelize.define('votes', {
		userHash: DataTypes.STRING,
		grade: DataTypes.STRING
	}, {});
	votes.associate = function (models) {
		// associations can be defined here
	};
	return votes;
};
