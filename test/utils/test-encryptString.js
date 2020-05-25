const encryptString = require('./../../utils/encryptString');
const { expect } = require('chai');
const crypto = require('crypto');

describe('encryptString', () => {
	it('should return the same hex when called multiple times with the same parameters', done => {
		const key = crypto.randomBytes(32);
		const iv = crypto.randomBytes(16);

		const string = encryptString('hello', key, iv);
		const string2 = encryptString('hello', key, iv);

		expect(string).to.equal(string2);

		done();
	});

	it('should reject keys with the wrong number of bytes', done => {
		const key = crypto.randomBytes(24);
		const iv = crypto.randomBytes(16);

		const encryptStringBound = encryptString.bind(null, 'hello', key, iv);

		expect(encryptStringBound).to.throw(
			Error,
			'The key must be a 32 byte Buffer.'
		);

		done();
	});

	it('should reject initialization vectors of the wrong number of bytes', done => {
		const key = crypto.randomBytes(32);
		const iv = crypto.randomBytes(8);

		const encryptStringBound = encryptString.bind(null, 'hello', key, iv);

		expect(encryptStringBound).to.throw(
			Error,
			'The initialization vector must be a 16 byte Buffer.'
		);

		done();
	});
});
