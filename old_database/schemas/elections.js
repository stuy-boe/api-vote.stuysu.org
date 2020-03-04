module.exports = (sequelize, Database) => {
	return sequelize.define('elections', {
		id: {
			type: Database.INTEGER,
			primaryKey: true,
			unique: true,
			autoIncrement: true
		},
		publicUrl: {
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
		startTime: {
			type: Database.DATE,
			allowNull: false
		},
		endTime: {
			type: Database.DATE,
			allowNull: false
		},
		visible: {
			type: Database.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		picture: Database.STRING,
		publicResults: {
			type: Database.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		completed: {
			type: Database.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	})
};
