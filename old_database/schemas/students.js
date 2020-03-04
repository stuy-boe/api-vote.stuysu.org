module.exports = (sequelize, Database) => {
	return sequelize.define('students', {
		email: {
			type: Database.STRING,
			primaryKey: true
		},
		grade: Database.STRING,
	}, {
		timestamps: false
	})
};
