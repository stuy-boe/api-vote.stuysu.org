/**
 * Generates a random string of a certain length from a given character set
 * @param  {Number} len - The length of the string
 * @param  {String} chars - The characters allowed in the random string
 * @return {String}
 */
module.exports = (len, chars = "abcdefghijklmnopqrstuvwxyz1234567890") =>
	Array(len)
		.fill(null)
		.map(() => chars[Math.floor(Math.random() * chars.length)])
		.join("");
