module.exports = (sequelize, Database) => {
	return sequelize.define("voteData", {
		choiceNumber: {
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
