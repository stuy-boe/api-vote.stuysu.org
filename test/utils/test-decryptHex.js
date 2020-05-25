const decryptHex = require('../../utils/decryptHex');

const {expect} = require('chai');

describe('decryptHex', () => {
  it('should decrypt strings correctly', done => {
    const originalString = 'hello';

    const encryptedHex = 'b0c72c05d52c712b8149cc13483aec01';

    const key = Buffer.from(
        '7ed9e7f3650184656525af4a9213a0a9566f27abf54fd4bca2724b58bef9db58',
        'hex');
    const iv = Buffer.from('dc45ffb2831d00011484e90ba065d94a', 'hex');

    const decryptedString = decryptHex(encryptedHex, key, iv);

    expect(decryptedString).to.equal(originalString);

    done();
  });

  it('should throw an error if a bad key or iv is provided', done => {
    const encryptedHex = 'b0c72c05d52c712b8149cc13483aec01';

    // This is not the correct key for the encrypted string above
    const key = Buffer.from(
        '6af7b631d9ec62cca95b0278b138fc3734317e36f1a693e6a526ec38f15975bd',
        'hex');

    const iv = Buffer.from('bf7af4957609032c569cfa35fce21ab4', 'hex');

    const decryptHexBound = decryptHex.bind(null, encryptedHex, key, iv);

    expect(decryptHexBound).to.throw(Error);

    done();
  });
});
