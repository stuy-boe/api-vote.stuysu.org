const { expect } = require('chai');
const RequestRefusalError = require('./../../utils/RequestRefusalError');

describe('RequestRefusalError', () => {
	const RequestRefusalErrorInstance = new RequestRefusalError(
		'Test Message',
		'ERROR_CODE'
	);

	it('should extend the Error class', done => {
		expect(RequestRefusalErrorInstance).to.be.an.instanceof(Error);

		done();
	});

	it('should have a message property', done => {
		expect(RequestRefusalErrorInstance).to.have.property(
			'message',
			'Test Message'
		);

		done();
	});

	it('should have an error code property', done => {
		expect(RequestRefusalErrorInstance).to.have.property(
			'code',
			'ERROR_CODE'
		);

		done();
	});

	it('should have the name: Request Refusal', done => {
		expect(RequestRefusalErrorInstance).to.have.property(
			'name',
			'Request Refusal'
		);

		done();
	});
});
