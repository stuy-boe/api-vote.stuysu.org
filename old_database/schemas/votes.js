module.exports = (sequelize, Database) => {
	return sequelize.define("votes", {
		id: {
			type: Database.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		userHash: {
			type: Database.STRING,
			allowNull: false
		},
		grade: {
			type: Database.STRING,
			allowNull: false
		}
	}, {
		timestamps: false
	});
};
