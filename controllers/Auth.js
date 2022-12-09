/* eslint-disable consistent-return */
// import bcrypt from 'bcrypt';

import argon2 from 'argon2';
import User from '../models/UserModel.js';

export const Login = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ msg: 'request client tidak sesuai' });
  }
};

export const getMe = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ msg: 'request client tidak sesuai' });
  }
};

export const Logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.status(400).json({ msg: 'Tidak dapat keluar!' });
      res.status(200).json({ msg: 'Anda telah keluar!' });
    });
  } catch (error) {
    res.status(400).json({ msg: 'request client tidak sesuai' });
  }
};
