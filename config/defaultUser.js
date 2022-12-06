/* eslint-disable no-unused-vars */
// import bcrypt from 'bcrypt';
import argon2 from 'argon2';
import Users from '../models/UserModel.js';

// const hashingWithArgon2 = async (plainText) => {
//   const hashedPalinText = await argon2.hash(plainText);
//   return hashedPalinText;
// };

// const hashingWithBcrypt = async (plainText, saltRounds) => {
//   const hashedPalinText = await bcrypt.hash(plainText, saltRounds);
//   return hashedPalinText;
// };

const dataUser = {
  name: 'admin',
  email: 'admin@gmail.com',
  password: await argon2.hash('123456'),
  confPassword: await argon2.hash('123456'),
  role: 'admin',
  image: 'profile.jpg',
};

const InsetDataToTable = async (table, value) => {
  try {
    await table.sync();
    await table.create(value);
    console.log('Data Sync has been created successfully');
    console.log(`User "${value.name}" telah dibuat...`);
  } catch (error) {
    console.log(`Terjadi kesalahan : ${error.message}`);
  }
};

InsetDataToTable(Users, dataUser);
