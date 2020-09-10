const mongoose = require('mongoose');
const shortid = require('shortid');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	email: { type: String, default: '' },
	gradYear: { type: Number, required: false },
	adminRoles: [String],

	// An array of ids of candidates that they are managers for
	managesCandidates: [String]
});

mongoose.model('User', UserSchema);
