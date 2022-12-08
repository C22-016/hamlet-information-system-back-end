import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';

const { DataTypes } = Sequelize;

const Message = db.define('message', {
  message_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  // userId jangan di kirim ke Clinet
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  // uuid yang dikirim kr client
  uuid: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  senderName: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  message_type: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  message_content: {
    type: DataTypes.TEXT,
    validate: {
      notEmpty: true,
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'belum ditangani',
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

Users.hasMany(Message);
Message.belongsTo(Users, { foreignKey: 'userId' });

export default Message;
