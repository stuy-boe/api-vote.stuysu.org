const router = require('express').Router();
const decryptHex = require('../utils/decryptHex');

router.use('*', (req, res, next) => {
	if (req.session.signedIn) {
		if (!req.signedCookies.decryptKey || !req.signedCookies.decryptIv) {
			req.session.signedIn = false;
			req.session.cookie.expires = new Date(1);
		} else {
			// The session is valid and we can reset the maxAge

			// Voting Station cookies are not rolling, do not reset expiration
			let isVotingStation = Boolean(req.cookies.isVotingStation);
			if (!isVotingStation) {
				let options = {
					maxAge: 1000 * 86400 * 30, // Normal cookie lasts for 30 days, voting
					// station lasts 5 min
					httpOnly: true, // The cookie only accessible by the web server
					signed: true // Indicates if the cookie should be signed
				};

				if (process.env.NODE_ENV === 'production') {
					options.secure = true;
					options.sameSite = 'none';
				}

				res.cookie('decryptIv', req.signedCookies.decryptIv, options);
				res.cookie('decryptKey', req.signedCookies.decryptKey, options);
				res.cookie('session', req.sessionID, options);
			}

			// Let's also provide a function to make it easier to decrypt the user Id

			req.session.getDecryptedUserId = () => {
				return decryptHex(
					req.session.encryptedUserId,
					Buffer.from(req.signedCookies.decryptKey, 'hex'),
					Buffer.from(req.signedCookies.decryptIv, 'hex')
				);
			};
		}
	}
	next();
});

module.exports = router;
