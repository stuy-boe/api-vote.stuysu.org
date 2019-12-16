const Database = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Database(
	(process.env.SEQUELIZE_DB || "database"),
	(process.env.SEQUELIZE_USER || "user"),
	(process.env.SEQUELIZE_PASS || "password"),
	{
		host: (process.env.SEQUELIZE_HOST || "localhost"),
		dialect: 'mysql',
		pool: {
			max: (Number(process.env.SEQUELIZE_CONN_LIMIT) || 5),
			min: 0,
			acquire: 30000,
			idle: 10000
		},
		define: {
			charset: 'utf8',
			collate: 'utf8_general_ci'
		},
		logging: (Boolean(process.env.SEQUELIZE_LOGGING) && process.env.SEQUELIZE_LOGGING !== "false" ? console.log : false)
	});

const Students = require("./../models/students")(sequelize, Database);
const Elections = require("./../models/elections")(sequelize, Database);
const Candidates = require("./../models/candidates")(sequelize, Database);
const Votes = require("./../models/votes")(sequelize, Database);

Votes.belongsTo(Elections);
Candidates.belongsTo(Elections);

sequelize.sync({force: true});

module.exports = {
	sequelize,
	Students,
	Elections,
	Candidates,
	Votes
};
