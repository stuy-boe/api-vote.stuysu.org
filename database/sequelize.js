const path = require('path');
const databaseFile = path.resolve(__dirname, './../app.db');

module.exports = {
	development: {
		url: process.env.SEQUELIZE_URL || `sqlite::${databaseFile}`,
		define: {
			charset: 'utf8',
			collate: 'utf8_unicode_ci'
		},
		ssl: true,
		native: true
	},
	production: {
		url: process.env.SEQUELIZE_URL,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
		define: {
			charset: 'utf8',
			collate: 'utf8_unicode_ci'
		},
		native: true,
		ssl: true,
		logging: false
	}
};
