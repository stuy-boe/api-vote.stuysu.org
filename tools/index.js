const crypto = require("crypto");

module.exports = {
	/**
	 * Generates a random string of a certain length from a given character set
	 * @param  {Number} len - The length of the string
	 * @param  {String} chars - The characters allowed in the random string
	 * @return {String}
	 */
	genString: (len, chars = "abcdefghijklmnopqrstuvwxyz1234567890") =>
		Array(len).fill(null).map(() => chars[Math.floor(Math.random() * chars.length)]).join(""),

	/**
	 * Encrypts a string using a given key and iv (salt)
	 * @param  {String} str - The string to encrypt
	 * @param  {String} key - The secret phrase used to encrypt the string (Must be 32 chars)
	 * @param {String} iv - A random salt used to prevent data repetition (Must be 16 chars)
	 * @return {String} - The encrypted string returned as a hex
	 */
	encryptString: (str, key, iv) => {
		let cipher = crypto.createCipheriv('aes256', key, iv);
		return cipher.update(str, 'utf8', 'hex') + cipher.final("hex");
	},

	/**
	 * Decrypts a hex given its key and iv (salt)
	 * @param  {String} encryptedHex - The encrypted string as a hex
	 * @param  {String} key - The key originally used to encrypt the string
	 * @param {String}  iv - The original iv (salt) used to encrypt the string
	 * @return {String} The original string as it existed before encryption (if successful)
	 */
	decryptHex: (encryptedHex, key, iv) => {
		let decipher = crypto.createDecipheriv("aes256", key, iv);
		return decipher.update(encryptedHex, "hex", "utf8") + decipher.final("utf8");
	},

	/**
	 * Breaks up a path into an array of its components
	 * @param  {String} path - The path (the url excluding the protocol, domain, hash, or query)
	 * @param  {Boolean} [toLower=true] - Whether or not to convert the entire path into lowercase before breaking it up
	 * @return {Array}
	 */
	splitURL: (path, toLower = true) => {
		if( toLower ) path = path.toLowerCase();

		return path.split("/").filter(item => Boolean(item));
	},

};
