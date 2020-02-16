module.exports = (sequelize, Database) => {
	return sequelize.define('candidates', {
		id: {
			type: Database.INTEGER,
			primaryKey: true,
			unique: true
		},
		name: {
			type: Database.STRING,
			allowNull: false
		},
		public_url: {
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
