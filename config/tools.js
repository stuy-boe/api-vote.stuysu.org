module.exports = {
	genString: (len, chars = "abcdefghijklmnopqrstuvwxyz1234567890") =>
		Array(len).fill(null).map(() => chars[Math.floor(Math.random() * chars.length)]).join(""),

};
