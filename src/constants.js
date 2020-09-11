require('dotenv').config();

const { randomBytes } = require('crypto');

exports.COOKIE_SECRET =
	process.env.COOKIE_SECRET || randomBytes(32).toString('hex');
exports.GOOGLE_CLIENT_ID =
	process.env.GOOGLE_CLIENT_ID ||
	'665058591652-nip7dff0g61g7n69lf3bgkvj16i9j6dm.apps.googleusercontent.com';

exports.NODE_ENV = process.env.NODE_ENV || 'development';

exports.CLOUDINARY_PREFIX = process.env.CLOUDINARY_PREFIX || 'vote.stuysu.org';
