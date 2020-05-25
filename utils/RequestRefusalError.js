class RequestRefusalError extends Error {
	constructor(message, code) {
		super();
		this.name = 'Request Refusal';
		this.message = message;
		this.code = code;
	}
}

module.exports = RequestRefusalError;
