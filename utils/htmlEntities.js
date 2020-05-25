/**
 * htmlEntities
 * Encodes a string by replacing angle-brackets, quotes, and ampersands with their html entities
 * @param  {String} str - The string to encode
 * @return {String} The new string with certain characters replaced
 */

const htmlEntities = str => {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};

module.exports = htmlEntities;
