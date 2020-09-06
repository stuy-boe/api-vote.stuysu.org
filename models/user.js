const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	email: { type: String, default: '' },
	gradYear: { type: Number, required: false },
	adminRoles: [String]
});

mongoose.model('User', UserSchema);
