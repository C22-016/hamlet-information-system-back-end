/* eslint-disable consistent-return */
// import bcrypt from 'bcrypt';

import argon2 from 'argon2';
import path from 'path';
import fs from 'fs';
import User from '../models/UserModel.js';

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ['uuid', 'name', 'email', 'role'],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ['uuid', 'name', 'email', 'role', 'image', 'url'],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  // Field Image & URL Image
  if (req.files === null) return res.status(400).json({ msg: 'Gambar belum diunggah!' });
  const file = req.files.image;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/profiles/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Tipe gambar tidak sesuai!' });

  if (fileSize > 2000000) return res.status(422).json({ msg: 'Ukuran gambar harus dibawah 2 MB!' });

  // Field others
  const {
    name, email, password, confPassword, role,
  } = req.body;

  if (password !== confPassword) return res.status(400).json({ msg: 'Kata Sandi dan Konfirmasi Kata Sandi tidak cocok!' });

  // If validation all success
  file.mv(`./public/profiles/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });

    // const hashPassword = await bcrypt.hash(password, 12);
    const hashPassword = await argon2.hash(password);
    try {
      await User.create({
        name,
        email,
        password: hashPassword,
        role,
        image: fileName,
        url,
      });
      res.status(201).json({ msg: 'Berhasil mendaftar!' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  });
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan!' });

  if (req.files === null) return res.status(400).json({ msg: 'Gambar tidak boleh kosong!' });

  let fileName = '';
  if (req.files === null) {
    fileName = User.image;
  } else {
    const file = req.files.image;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Tipe gambar tidak sesuai!' });

    if (fileSize > 2000000) return res.status(422).json({ msg: 'Ukuran gambar harus dibawah 2 MB!' });

    const filePath = `./public/profiles/${user.image}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/profiles/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const url = `${req.protocol}://${req.get('host')}/profiles/${fileName}`;
  const {
    name, email, password, confPassword, role,
  } = req.body;

  let hashPassword;
  if (password === '' || password === null) {
    hashPassword = user.password;
  } else {
    // hashPassword = await bcrypt.hash(password, 12);
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword) return res.status(400).json({ msg: 'Kata Sandi dan Konfirmasi Kata Sandi tidak cocok!' });

  try {
    await User.update({
      name,
      email,
      password: hashPassword,
      role,
      image: fileName,
      url,
    }, {
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: 'Pengguna berhasil diperbarui!' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: 'Pengguna tidak ditemukan!' });

  try {
    const filePath = `./public/profiles/${user.image}`;
    fs.unlinkSync(filePath);

    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: 'Pengguna berhasil dihapus!' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
