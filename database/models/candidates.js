'use strict';
module.exports = (sequelize, DataTypes) => {
	const candidates = sequelize.define('candidates', {
		name: DataTypes.STRING,
		electionId: DataTypes.INTEGER,
		publicUrl: DataTypes.STRING,
		active: DataTypes.BOOLEAN
	}, {});
	candidates.associate = function (models) {
		// associations can be defined here
		candidates.belongsTo(models.elections, {foreignKey: "electionId", targetKey: "id"});
	};
	return candidates;
};
