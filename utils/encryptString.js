const crypto = require('crypto');

/**
 * Encrypts a string using a given key and iv (salt)
 * @param  {String} str - The string to encrypt
 * @param  {String} key - The secret phrase used to encrypt the string (Must be 32 chars)
 * @param {String} iv - A random salt used to prevent data repetition (Must be 16 chars)
 * @return {String} - The encrypted string returned as a hex
 */
module.exports = (str, key, iv) => {
	let cipher = crypto.createCipheriv('aes256', key, iv);
	return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
};
