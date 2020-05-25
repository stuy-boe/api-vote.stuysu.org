const crypto = require('crypto');

/**
 * Decrypts a hex given its key and iv (salt)
 * @param  {String} encryptedHex - The encrypted string as a hex
 * @param  {Buffer} key - The key originally used to encrypt the string
 * @param {Buffer}  iv - The original iv (salt) used to encrypt the string
 * @return {String} The original string as it existed before encryption (if successful)
 */
module.exports = (encryptedHex, key, iv) => {
	if (key.length !== 32) {
		throw new Error('The key must be a 32 byte Buffer.');
	}

	if (iv.length !== 16) {
		throw new Error('The initialization vector must be a 16 byte Buffer.');
	}

	let decipher = crypto.createDecipheriv('aes256', key, iv);
	return (
		decipher.update(encryptedHex, 'hex', 'utf8') + decipher.final('utf8')
	);
};
