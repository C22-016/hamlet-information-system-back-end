/* eslint-disable new-cap */
import express from 'express';
import FileUpload from 'express-fileupload';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import SequelizeStore from 'connect-session-sequelize';
import db from './config/Database';
import UserRoute from './routes/UserRoute';
import ArchiveRoute from './routes/ArchiveRoute';
import AuthRoute from './routes/AuthRoute';

dotenv.config();
const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db,
});

// Code for created table database
// (async () => {
//   await db.sync();
// })();

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

// Code for created table session
// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log('Server up and running...');
});
