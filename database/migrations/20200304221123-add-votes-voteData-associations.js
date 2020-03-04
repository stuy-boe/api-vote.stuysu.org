'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'votedata', // name of Source model
			'voteId', // name of the key we're adding
			{
				type: Sequelize.INTEGER,
				references: {
					model: 'votes', // name of Target model
					key: 'id', // key in Target model that we're referencing
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			}
		);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn(
			'votedata', // name of Source model
			'voteId' // key we want to remove
		);
	}
};
