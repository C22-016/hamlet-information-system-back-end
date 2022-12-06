import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOSTNAME,
  dialect: 'mysql',
  // dialectOptions: {
  //   useUTC: false, // timezone for reading from database
  // },
  logging: false, // loging for reading or writing from database
  timezone: '+07:00', // timezone for writing to database
});

export default db;
