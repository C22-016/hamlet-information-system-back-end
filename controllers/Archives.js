/* eslint-disable consistent-return */

import dotenv from 'dotenv';
import { Op } from 'sequelize';
import Archive from '../models/ArchiveModel.js';
import User from '../models/UserModel.js';

dotenv.config();

export const getArchives = async (req, res) => {
  try {
    let response;
    if (req.role === process.env.FULL_ACCESS || req.role === process.env.MID_ACCESS) {
      response = await Archive.findAll({
        attributes: ['uuid', 'name', 'link', 'desc', 'createdAt', 'updatedAt'],
        include: [{
          model: User,
          attributes: ['name', 'email', 'role'],
        }],
      });
    } else {
      response = await Archive.findAll({
        attributes: ['uuid', 'name', 'link', 'desc', 'createdAt', 'updatedAt'],
        include: [{
          model: User,
          attributes: ['name', 'email', 'role'],
        }],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getArchiveById = async (req, res) => {
  try {
    const archive = await Archive.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!archive) return res.status(404).json({ msg: 'Data arsip tidak ditemukan!' });

    let response;
    if (req.role === process.env.FULL_ACCESS || req.role === process.env.MID_ACCESS) {
      response = await Archive.findOne({
        attributes: ['uuid', 'name', 'link', 'desc', 'createdAt', 'updatedAt'],
        where: {
          id: archive.id,
        },
        include: [{
          model: User,
          attributes: ['name', 'email', 'role'],
        }],
      });
    } else {
      response = await Archive.findOne({
        attributes: ['uuid', 'name', 'link', 'desc', 'createdAt', 'updatedAt'],
        include: [{
          model: User,
          attributes: ['name', 'email', 'role'],
        }],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createArchive = async (req, res) => {
  const { name, link, desc } = req.body;
  try {
    await Archive.create({
      name,
      link,
      desc,
      userId: req.userId,
    });
    res.status(201).json({ msg: 'Arsip berhasil ditambahkan!' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateArchive = async (req, res) => {
  try {
    const archive = await Archive.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!archive) return res.status(404).json({ msg: 'Data arsip tidak ditemukan!' });

    const { name, link, desc } = req.body;
    if (req.role === process.env.FULL_ACCESS) {
      await Archive.update({ name, link, desc }, {
        where: {
          id: archive.id,
        },
      });
    } else if (req.role === process.env.MID_ACCESS) {
      if (req.userId !== archive.userId) return res.status(403).json({ msg: 'Akses terlarang!' });

      await Archive.update({ name, link, desc }, {
        where: {
          [Op.and]: [{ id: archive.id }, { userId: req.userId }],
        },
      });
    } else {
      return res.status(403).json({ msg: 'Akses terlarang!' });
    }
    res.status(200).json({ msg: 'Arsip berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteArchive = async (req, res) => {
  try {
    const archive = await Archive.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!archive) return res.status(404).json({ msg: 'Data arsip tidak ditemukan!' });

    if (req.role === process.env.FULL_ACCESS) {
      await Archive.destroy({
        where: {
          id: archive.id,
        },
      });
    } else if (req.role === process.env.MID_ACCESS) {
      if (req.userId !== archive.userId) return res.status(403).json({ msg: 'Akses terlarang!' });

      await Archive.destroy({
        where: {
          [Op.and]: [{ id: archive.id }, { userId: req.userId }],
        },
      });
    } else {
      return res.status(403).json({ msg: 'Akses terlarang!' });
    }
    res.status(200).json({ msg: 'Arsip berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
