class RefusalError extends Error {
	constructor(message, code) {
		super();
		this.name = "Refusal";
		this.message = message;
		this.code = code;
	}
}

module.exports = RefusalError;
