'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('elections', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			publicUrl: {
				type: Sequelize.STRING
			},
			name: {
				type: Sequelize.STRING
			},
			type: {
				type: Sequelize.STRING
			},
			startTime: {
				type: Sequelize.DATE
			},
			endTime: {
				type: Sequelize.DATE
			},
			visible: {
				type: Sequelize.BOOLEAN
			},
			picture: {
				type: Sequelize.STRING
			},
			publicResults: {
				type: Sequelize.BOOLEAN
			},
			completed: {
				type: Sequelize.BOOLEAN
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('elections');
	}
};
