const crypto = require('crypto');

/**
 * Decrypts a hex given its key and iv (salt)
 * @param  {String} encryptedHex - The encrypted string as a hex
 * @param  {String} key - The key originally used to encrypt the string
 * @param {String}  iv - The original iv (salt) used to encrypt the string
 * @return {String} The original string as it existed before encryption (if successful)
 */
module.exports = (encryptedHex, key, iv) => {
	let decipher = crypto.createDecipheriv('aes256', key, iv);
	return (
		decipher.update(encryptedHex, 'hex', 'utf8') + decipher.final('utf8')
	);
};
