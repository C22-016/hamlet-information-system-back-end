// import bcrypt from 'bcrypt';
import argon2 from 'argon2';

// const hashPassword = await bcrypt.hash('123456', 12);
const hashPassword = await argon2.hash('123456');

const defaultUser = {
  name: 'admin',
  email: 'admin@gmail.com',
  password: hashPassword,
  confPassword: hashPassword,
  role: 'admin',
  image: 'profile.jpg',
};

export default defaultUser;
