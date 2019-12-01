module.exports = (sequelize, type) => {
	return sequelize.define('students', {
		email: {
			type: type.STRING,
			primaryKey: true
		},
		grade: type.INTEGER,
	}, {
		timestamps: false
	})
};
