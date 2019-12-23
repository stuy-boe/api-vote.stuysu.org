const tools = require("./tools");

const sessionValidator = (req, res, next) => {
	try {
		if(req.session.signed_in) {
			if (!req.signedCookies.decryptKey || !req.signedCookies.decryptIv)
				throw "Decryption cookies missing";

			let decrypt_test = tools.decryptHex(req.session.sessionTest, req.signedCookies.decryptKey, req.signedCookies.decryptIv);
			if (decrypt_test !== tools.getDecryptionTestString())
				throw "Decryption test failed";
		}
	} catch(e) {
		req.session.signed_in = false;
		req.session.cookie.expires = new Date(1);
	}

	next();
};

module.exports = sessionValidator;
