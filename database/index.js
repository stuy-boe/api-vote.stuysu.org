const Database = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

let sequelize_options = {
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

if(process.env.SEQUELIZE_SSL === "false"){
	sequelize_options.ssl = false;
	sequelize_options.native = false;
}

const sequelize = new Database(
	process.env.CLEARDB_DATABASE_URL || process.env.SEQUELIZE_URL || "sqlite:./app.db",
	sequelize_options
);

const Students = require("./schemas/students")(sequelize, Database);
const Elections = require("./schemas/elections")(sequelize, Database);
const Candidates = require("./schemas/candidates")(sequelize, Database);
const Votes = require("./schemas/votes")(sequelize, Database);
const VoteData = require("./schemas/voteData")(sequelize, Database);
const AllowedGrades = require("./schemas/allowedGrades")(sequelize, Database);

VoteData.belongsTo(Votes);
Elections.hasMany(Votes);
Elections.hasMany(Candidates);
Votes.belongsTo(Elections);
Candidates.belongsTo(Elections);
AllowedGrades.belongsTo(Elections, {foreignKey: "electionId"});
Elections.hasMany(AllowedGrades, {foreignKey: "electionId"});

sequelize.sync(
	// {force: true}
	);

module.exports = {
	sequelize,
	Students,
	Elections,
	Candidates,
	Votes,
	VoteData
};
