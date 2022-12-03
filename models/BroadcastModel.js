import { nanoid } from 'nanoid';
import { Sequelize } from 'sequelize';
import db from '../config/Database';

const { DataTypes } = Sequelize;

const Broadcast = db.define('broadcast', {
  broadcast_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: `notif-${nanoid(9)}`,
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
}, {
  freezeTableName: true,
  timestamps: true,
  updatedAt: false,
});

export default Broadcast;
