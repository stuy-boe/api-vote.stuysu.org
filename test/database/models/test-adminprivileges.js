const { adminPrivileges, Sequelize } = require('./../../../database');
const { expect } = require('chai');

describe('adminPrivileges', () => {
	let testRowIds = [];

	before(async () => {
		// insert some test rows

		const testPrivilege = await adminPrivileges.create({
			email: 'email@example.com',
			privilege: 'elections'
		});

		testRowIds.push(testPrivilege.id);
	});

	describe('#list', () => {
		it('should return an array', async () => {
			const test1 = await adminPrivileges.list('email@example.com');
			const test2 = await adminPrivileges.list('');

			expect(test1).to.be.an.instanceOf(Array);
			expect(test2).to.be.an.instanceOf(Array);
		});

		it('should return correct information', async () => {
			// We created this test row in the before hook
			const test1 = await adminPrivileges.list('email@example.com');
			expect(test1).to.include('elections');
		});
	});

	describe('#exists', () => {
		it('should return a boolean', async () => {
			const test1 = await adminPrivileges.exists(
				'email@example.com',
				'elections'
			);
			const test2 = await adminPrivileges.exists('', 'elections');

			expect(test1).to.be.a('boolean');
			expect(test2).to.be.a('boolean');
		});

		it('should return correct information', async () => {
			const test1 = await adminPrivileges.exists(
				'email@example.com',
				'elections'
			);

			const test2 = await adminPrivileges.exists('', 'elections');

			expect(test1).to.be.true;
			expect(test2).to.be.false;
		});
	});

	after(async () => {
		// Delete the test rows that we created
		await adminPrivileges.destroy({
			where: {
				id: testRowIds
			}
		});
	});
});
