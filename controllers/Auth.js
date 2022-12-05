/* eslint-disable consistent-return */
// import bcrypt from 'bcrypt';

import argon2 from 'argon2';
import User from '../models/UserModel.js';

export const Login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan!' });

  // bcrypt.compare('plainTextPassword', 'hashPassword)
  // const match = await bcrypt.compare(req.body.password, user.password);
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: 'Password yang dimasukan salah!' });

  req.session.userId = user.uuid;
  const {
    uuid, name, email, role,
  } = user;
  res.status(200).json({
    uuid, name, email, role,
  });
};

export const getMe = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: 'Mohon login terlebih dahulu!' });
  }

  const user = await User.findOne({
    attributes: ['uuid', 'name', 'email', 'role', 'image', 'url'],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan!' });

  res.status(200).json(user);
};

export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: 'Tidak dapat keluar!' });
    res.status(200).json({ msg: 'Anda telah keluar!' });
  });
};
