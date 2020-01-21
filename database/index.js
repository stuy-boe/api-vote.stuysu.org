const Database = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

let sequelize_options = {
	host: (process.env.SEQUELIZE_HOST || "localhost"),
	dialect: (process.env.SEQUELIZE_DIALECT || "sqlite"),
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
	native: true,
	ssl: true,
	logging: (process.env.SEQUELIZE_LOGGING === "true" ? console.log : false)
};

if(process.env.SEQUELIZE_PORT)
	sequelize_options.port = Number(process.env.SEQUELIZE_PORT);

if(! process.env.SEQUELIZE_DIALECT || process.env.SEQUELIZE_DIALECT === "sqlite")
	sequelize_options.storage = process.env.SEQUELIZE_STORAGE || "./app.db";

if(process.env.SEQUELIZE_SSL === "false"){
	sequelize_options.ssl = false;
	sequelize_options.native = false;
}

const sequelize = new Database(
	(process.env.SEQUELIZE_DB || "database"),
	(process.env.SEQUELIZE_USER || "user"),
	(process.env.SEQUELIZE_PASS || "password"),
	sequelize_options);

const Students = require("./schemas/students")(sequelize, Database);
const Elections = require("./schemas/elections")(sequelize, Database);
const Candidates = require("./schemas/candidates")(sequelize, Database);
const Votes = require("./schemas/votes")(sequelize, Database);
const Vote_Data = require("./schemas/vote_data")(sequelize, Database);

Vote_Data.belongsTo(Votes);
Elections.hasMany(Votes);
Elections.hasMany(Candidates);
Votes.belongsTo(Elections);
Candidates.belongsTo(Elections);

sequelize.sync(
	// {force: true}
	);

module.exports = {
	sequelize,
	Students,
	Elections,
	Candidates,
	Votes
};
