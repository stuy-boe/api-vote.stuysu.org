module.exports = (sequelize, Database) => {
	return sequelize.define("vote_data", {
		choice_number: {
			type: Database.INTEGER,
			allowNull: false
		},
		data: {
			type: Database.STRING,
			allowNull: false
		}
	}, {
		timestamps: false
	});
};
