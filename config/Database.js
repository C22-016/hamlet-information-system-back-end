import { Sequelize } from 'sequelize';

const db = new Sequelize('his_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
