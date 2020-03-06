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

		return queryInterface.bulkInsert('elections', [
			{
				id: -1,
				publicUrl: "super-senior-caucus",
				name: "Super Senior Caucus",
				type: "runoff",
				startTime: new Date(),
				endTime: new Date(new Date().getTime() + (1000 * 60 * 60 * 24)),
				visible: 1,
				picture: "https://source.unsplash.com/400x300/?vote",
				publicResults: false,
				completed: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

		], {});
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.bulkDelete('People', null, {});
		*/
		return queryInterface.bulkDelete("elections", {id: -1}, {});
	}
};
