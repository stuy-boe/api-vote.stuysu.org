'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
		  Add altering commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkInsert('People', [{
			name: 'John Doe',
			isBetaMember: false
		  }], {});
		*/
		return queryInterface.bulkInsert('candidates', [
			{
				id: -1,
				name: 'Bernie Sanders',
				electionId: -1,
				publicUrl: 'sanders',
				active: true,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: -2,
				name: 'Elizabeth Warren',
				electionId: -1,
				publicUrl: 'warren',
				active: true,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('People', null, {});
		*/
		return queryInterface.bulkDelete('candidates', {
			electionId: -1
		});
	}
};
