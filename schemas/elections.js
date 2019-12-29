module.exports = (sequelize, Database) => {
	return sequelize.define('elections', {
		id: {
			type: Database.INTEGER,
			primaryKey: true,
			unique: true,
			autoIncrement: true
		},
		public_url: {
			type: Database.STRING(32),
			unique: true,
			allowNull: false
		},
		name: {
			type: Database.STRING,
			allowNull: false
		},
		type: {
			type: Database.STRING,
			allowNull: false
		},
		start_time: {
			type: Database.DATE,
			allowNull: false
		},
		end_time: {
			type: Database.DATE,
			allowNull: false
		},
		active: {
			type: Database.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		completed: {
			type: Database.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	})
};
