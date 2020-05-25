const crypto = require('crypto');

/**
 * encryptString
 * Encrypts a string using a given key and iv (salt)
 * @param  {String} str - The string to encrypt
 * @param  {Buffer} key - The secret phrase used to encrypt the string (Must be
 *     32 bytes)
 * @param {Buffer} iv - A random salt used to prevent data repetition (Must be
 *     16 bytes)
 * @return {String} - The encrypted string returned as a hex
 */
const encryptString = (str, key, iv) => {
	if (key.length !== 32) {
		throw new Error('The key must be a 32 byte Buffer.');
	}

	if (iv.length !== 16) {
		throw new Error('The initialization vector must be a 16 byte Buffer.');
	}

	let cipher = crypto.createCipheriv('aes256', key, iv);
	return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
};

module.exports = encryptString;
