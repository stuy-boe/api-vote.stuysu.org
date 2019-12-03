module.exports = (sequelize, Database) => {
	return sequelize.define('candidates', {
		id: {
			type: Database.STRING(6),
			primaryKey: true,
			unique: true
		},
		name: {
			type: Database.STRING,
			allowNull: false
		},
		active: {
			type: Database.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	}, {
		timestamps: false
	});
};
