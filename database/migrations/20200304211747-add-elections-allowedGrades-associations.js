'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'allowedGrades', // name of Source model
        'electionId', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'elections', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
        'allowedGrades', // name of Source model
        'electionId' // key we want to remove
    );
  }
};
