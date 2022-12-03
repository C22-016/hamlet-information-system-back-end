import { Sequelize } from 'sequelize';

const db = new Sequelize('his_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    useUTC: false, // timezone for reading from database
  },
  timezone: '+07:00', // timezone for writing to database
});

export default db;
