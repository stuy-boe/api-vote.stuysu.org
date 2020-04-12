/**
 * Encodes a string by replacing angle-brackets, quotes, and ampersands with their html entities
 * @param  {String} str - The string to encode
 * @return {String} The new string with certain characters replaced
 */
module.exports = str => {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};
