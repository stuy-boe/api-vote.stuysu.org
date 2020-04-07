const router = require("express").Router();

const encryptString = require("../../../utils/encryptString");
const genString = require("../../../utils/genString");

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const RefusalError = require("./../../../utils/RefusalError");

router.post("/", async (req, res) => {

	const idToken = req.body.idToken;
	const isVotingStation = Boolean(req.cookies.isVotingStation);

	let payload;

	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		payload = ticket.getPayload();

	} catch (e) {

		throw new RefusalError("The provided login token was invalid.", "INVALID_ID_TOKEN");

	}

	if(req.session.signedIn){
		throw new RefusalError("You are already signed in.", "SIGNED_IN");
	}

	if(! payload.email_verified){
		throw new RefusalError("That email is not verified and cannot be used for sign in.", "UNVERIFIED_EMAIL");
	}

	if( payload.azp !== process.env.REACT_APP_GOOGLE_CLIENT_ID ||
		payload.aud !== process.env.REACT_APP_GOOGLE_CLIENT_ID
	){
		throw new RefusalError("That login token was not generated for this app and cannot be used.", "INVALID_ID_TOKEN");
	}

	// Create session now that info has been validated
	// Generate a random key and salt to encrypt the user's sub (secret user id)
	const encryptKey = genString(32);
	const encryptIv = genString(16);

	const maxAge = isVotingStation ? 1000 * 60 * 5 : 1000 * 86400 * 30;

	// Create a user cookie to store the information needed to decrypt the user id
	// The decryption keys only exist on the user side
	const options = {
		maxAge, // Normal cookie lasts for 30 days, voting station lasts 5 min
		httpOnly: true, // The cookie only accessible by the web server
		signed: true, // Indicates if the cookie should be signed
	};

	if(process.env.NODE_ENV === "production"){
		options.secure = true;
		options.sameSite = "none";
	}

	res.cookie('decryptKey', encryptKey, options);
	res.cookie('decryptIv', encryptIv, options);

	req.session.signedIn = true;
	req.session.email = payload.email;
	req.session.name = payload.name;
	req.session.cookie.expires = new Date(new Date().getTime() + maxAge);
	req.session.encryptedID = encryptString(payload.sub, encryptKey, encryptIv);

	res.json({success: true});

});

module.exports = router;
