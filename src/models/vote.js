const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VoteSchema = new Schema({
	_id: {
		type: String,
		required: true
	},
	electionId: String,
	grade: Number,
	choices: [String]
});

mongoose.model('Vote', VoteSchema);
