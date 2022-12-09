/* eslint-disable consistent-return */

import dotenv from 'dotenv';
import User from '../models/UserModel.js';

dotenv.config();

export const verifyUser = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: 'Mohon login terlebih dahulu!' });
    }

    const user = await User.findOne({
      where: {
        uuid: req.session.userId,
      },
    });
    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan!' });

    req.userId = user.id;
    req.role = user.role;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server tidak bisa menangani' });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.session.userId,
      },
    });
    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan!' });

    if (user.role !== process.env.FULL_ACCESS) return res.status(403).json({ msg: 'Akses terlarang!' });
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server tidak bisa menangani' });
  }
};

export const adminAndStafOnly = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.session.userId,
      },
    });
    if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan!' });

    if (user.role !== process.env.FULL_ACCESS && user.role !== process.env.MID_ACCESS) return res.status(403).json({ msg: 'Akses terlarang!' });
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server tidak bisa menangani' });
  }
};
