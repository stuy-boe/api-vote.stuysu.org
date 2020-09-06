const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ElectionSchema = new Schema({
	name: String,
	url: { type: String, unique: true },
	type: { type: String },
	start: Date,
	end: Date,
	picture: {
		publicId: String,
		defaultUrl: String
	},
	complete: { type: Boolean, default: false },
	allowEdit: { type: Boolean, default: false },
	allowDelete: { type: Boolean, default: false },
	numChoices: Number
});

mongoose.model('Election', ElectionSchema);
