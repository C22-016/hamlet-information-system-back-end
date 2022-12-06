/* eslint-disable new-cap */

import express from 'express';
import FileUpload from 'express-fileupload';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import SequelizeStore from 'connect-session-sequelize';
import db from './config/Database.js';

/** route */
import UserRoute from './routes/UserRoute.js';
import ArchiveRoute from './routes/ArchiveRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import BroadcastRoute from './routes/BroadcastRoute.js';

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
  origin: process.env.CORS_ORIGIN,
}));

app.use(express.json());
app.use(FileUpload());
app.use(express.static('public'));

app.use(UserRoute);
app.use(ArchiveRoute);
app.use(AuthRoute);
app.use(BroadcastRoute);

/** Code for Sync the database */
// db.sync()
//   .then(() => console.log('Database sync was successful'))
//   .catch((error) => console.log(error));

app.listen(process.env.APP_PORT, () => {
  console.log('Server up and running...');
});
