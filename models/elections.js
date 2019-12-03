module.exports = (sequelize, Database) => {
	return sequelize.define('elections', {
		id: {
			type: Database.STRING(8),
			primaryKey: true,
			unique: true
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
