module.exports = (sequelize, Database) => {
	return sequelize.define('allowedGrades', {
		electionId: {
			type: Database.INTEGER,
		},
		grade: {
			type: Database.STRING
		}
	}, {
		timestamps: false
	});
};
