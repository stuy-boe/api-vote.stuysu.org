const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const models = [];
const thisFile = path.resolve(__filename);

const files = fs.readdirSync(__dirname);

files
	.map(schema => path.resolve(__dirname, schema))
	.filter(file => file !== thisFile)
	.forEach(file => {
		require(file);
	});

mongoose.connect(process.env.MONGO_URL, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

module.exports = models;
