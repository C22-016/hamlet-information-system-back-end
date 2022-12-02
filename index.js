/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */

import express from 'express';
import FileUpload from 'express-fileupload';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import SequelizeStore from 'connect-session-sequelize';
import db from './config/Database';

/** route */
import UserRoute from './routes/UserRoute';
import ArchiveRoute from './routes/ArchiveRoute';
import AuthRoute from './routes/AuthRoute';

/** ********************************************************
 * User Model use for create defaultuser
 * You can disable this if the user already exists in the database
 * */
import defaultUser from './config/defaultUser';
import Users from './models/UserModel';
/** ***************************************************** */

dotenv.config();
const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db,
});

app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: true,
  store,
  cookie: {
    secure: 'auto',
  },
}));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));

app.use(express.json());
app.use(FileUpload());
app.use(express.static('public'));

app.use(UserRoute);
app.use(ArchiveRoute);
app.use(AuthRoute);

/** Code for created table session */
// store.sync();

/** Code for Sync the databases */
db.sync()
  .then(() => console.log('Database sync was successful'))
  .catch((error) => console.log(error));

/** ******************************************************************
 * Create Default User { user: admin , password: 123456}
 * Disable this code if the admin is already available in the database.
 * */

// Users.create(defaultUser)
//   .then(() => console.log('default user has been created successfully'))
//   .catch((error) => console.log(error));

/** ****************************************************************** */

app.listen(process.env.APP_PORT, () => {
  console.log('Server up and running...');
});
