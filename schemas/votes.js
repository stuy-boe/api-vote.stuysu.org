module.exports = (sequelize, Database) => {
	return sequelize.define("votes", {
		id: {
			type: Database.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
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
