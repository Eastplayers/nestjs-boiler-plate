const createTableTemplate = (Sequelize, attributes) => ({
  id: {
    primaryKey: true,
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV4,
  },
  ...attributes,
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
module.exports = {
  createTableTemplate,
};
