'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
      },
      avatar: {
        type: Sequelize.DataTypes.STRING,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
      },
      provider: {
        type: Sequelize.DataTypes.STRING,
      },
      reset_password_token: {
        type: Sequelize.DataTypes.TEXT,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
      },
      deleted_at: {
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable({
      tableName: 'users',
    });
  },
};
