const mongoose = require('mongoose');
const shortid = require('shortid');

const Schema = mongoose.Schema;

const ElectionSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
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
