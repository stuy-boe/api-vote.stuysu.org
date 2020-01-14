const tools = require("./../../config/tools");
const router = require("express").Router();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

async function validateToken(token) {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
	});

	return ticket.getPayload();
}

router.post("/", (req, res) => {
	const idToken = req.body.idToken;
	const isVotingStation = Boolean(req.cookies.isVotingStation);

	validateToken(idToken)
		.then(payload => {
			if(req.session.signed_in)
				return "You are already signed in.";

			if(! payload.email_verified)
				return "That email is not verified and cannot be used for sign in.";

			if( payload.azp !== process.env.REACT_APP_GOOGLE_CLIENT_ID || payload.aud !== process.env.REACT_APP_GOOGLE_CLIENT_ID )
				return "That login token was not generated for this app and cannot be used.";

			// Create session now that info has been validated
			// Generate a random key and salt to encrypt the user's sub (secret user id)
			let encryptKey = tools.genString(32);
			let encryptIv = tools.genString(16);

			let maxAge = isVotingStation ? 1000 * 60 * 5 : 1000 * 86400 * 30;

			// Create a user cookie to store the information needed to decrypt the user id
			// The decryption keys only exist on the user side
			let options = {
				maxAge: maxAge, // Normal cookie lasts for 30 days, voting station lasts 5 min
				httpOnly: true, // The cookie only accessible by the web server
				signed: true // Indicates if the cookie should be signed
			};

			res.cookie('decryptKey', encryptKey, options);
			res.cookie('decryptIv', encryptIv, options);

			req.session.signed_in = true;
			req.session.email = payload.email;
			req.session.name = payload.name;
			req.session.cookie.expires = new Date(new Date().getTime() + maxAge);
			req.session.encryptedID = tools.encryptString(payload.sub, encryptKey, encryptIv);
			res.json({success: true});
		})
		.then((known_error = null) => {
			// If known_error is set that means we intentionally didn't trust the login attempt
			if(known_error !== null)
				res.json({success: false, error: known_error});
		})
		.catch(er => {
			console.log(er);
			//Being here likely means the token was invalid
			res.json({success: false, error: "The login token provided was invalid."});
		});
});

module.exports = router;
