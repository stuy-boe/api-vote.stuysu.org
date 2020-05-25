const { expect } = require('chai');

const shortHash = require('./../../utils/shortHash');

describe('shortHash', () => {
	it('should return a string', done => {
		const test1 = shortHash('hello');
		const test2 = shortHash('goodbye');

		expect(test1).to.be.a('string');
		expect(test2).to.be.a('string');

		done();
	});

	it('should return a string with length 16', done => {
		const test1 = shortHash('hello');
		const test2 = shortHash('goodbye');

		expect(test1).to.have.length(16);
		expect(test2).to.have.length(16);

		done();
	});

	it('should accept a string', done => {
		const shortHashBound = shortHash.bind(null, 'hello');

		expect(shortHashBound).to.not.throw(Error);

		done();
	});

	it('should accept a buffer', done => {
		const shortHashBound = shortHash.bind(null, Buffer.from('hello'));

		expect(shortHashBound).to.not.throw(Error);

		done();
	});

	it('should not accept an object', done => {
		const shortHashBound = shortHash.bind(null, {});

		expect(shortHashBound).to.throw(Error);

		done();
	});

	it('should correctly calculate the sha256 hash', done => {
		const test1 = shortHash('hello');
		expect(test1).to.equal('2cf24dba5fb0a30e');

		const test2 = shortHash('goodbye');
		expect(test2).to.equal('82e35a63ceba37e9');

		done();
	});
});
