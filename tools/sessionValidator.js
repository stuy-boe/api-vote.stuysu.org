const router = require("express").Router();

router.use("*", sessionValidator = (req, res, next) => {
	if(req.session.signed_in) {
		if (!req.signedCookies.decryptKey || !req.signedCookies.decryptIv){
			req.session.signed_in = false;
			req.session.cookie.expires = new Date(1);
		} else {

			// The session is valid and we can reset the maxAge

			// Voting Station cookies are not rolling, do not reset expiration
			let isVotingStation = Boolean(req.cookies.isVotingStation);
			if(! isVotingStation){
				let options = {
					maxAge: 1000 * 86400 * 30, // Normal cookie lasts for 30 days, voting station lasts 5 min
					httpOnly: true, // The cookie only accessible by the web server
					signed: true // Indicates if the cookie should be signed
				};
				res.cookie('decryptIv', req.signedCookies.decryptIv, options);
				res.cookie('decryptKey', req.signedCookies.decryptKey, options);
			}
		}
	}
	next();
});

module.exports = router;
