import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';

const { DataTypes } = Sequelize;

const Broadcast = db.define('broadcast', {
  broadcast_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 100],
    },
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    validate: {
      notEmpty: true,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
}, {
  freezeTableName: true,
  timestamps: true,
  updatedAt: false,
});

Users.hasMany(Broadcast);
Broadcast.belongsTo(Users, { foreignKey: 'userId' });

export default Broadcast;
